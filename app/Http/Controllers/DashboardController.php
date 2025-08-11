<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Proposal;
use App\Models\Kegiatan;
use App\Models\Tim;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard yang disesuaikan dengan peran pengguna.
     */
    public function index()
    {
        $user = Auth::user();
        $stats = [];
        $chartData = [];
        $events = []; // Inisialisasi variabel events

        // Data grafik untuk admin
        $queryProposalPerBulan = Proposal::selectRaw('MONTH(tanggal_pengajuan) as month, COUNT(*) as count')
            ->whereYear('tanggal_pengajuan', date('Y'))
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();
        
        $queryKegiatanPerBulan = Kegiatan::selectRaw('MONTH(tanggal_kegiatan) as month, COUNT(*) as count')
            ->whereYear('tanggal_kegiatan', date('Y'))
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();


        switch ($user->role) {
            case 'admin':
                $stats = [
                    'total_pengguna' => User::count(),
                    'total_proposal' => Proposal::count(),
                    'total_kegiatan' => Kegiatan::count(),
                    'kegiatan_selesai' => Proposal::where('status', 'diajukan')->count(),
                ];
                $chartData['proposal'] = $queryProposalPerBulan;
                $chartData['kegiatan'] = $queryKegiatanPerBulan;
                break;

            case 'kadis':
                $stats = [
                    'proposal_perlu_verifikasi' => Proposal::where('status', 'diajukan')->count(),
                    'proposal_sudah_diverifikasi' => Proposal::whereIn('status', ['disetujui', 'ditolak'])->count(),
                    'total_tim' => Tim::count(),
                ];
                $chartData['proposal_verification'] = Proposal::whereIn('status', ['disetujui', 'ditolak'])
                    ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
                    ->whereYear('updated_at', date('Y'))
                    ->groupBy('month')
                    ->pluck('count', 'month')->toArray();
                break;

            case 'kabid':
                $stats = [
                    'proposal_siap_dibuat_kegiatan' => Proposal::where('status', 'disetujui')->doesntHave('kegiatan')->count(),
                    'total_tim_dibentuk' => Tim::count(),
                    'kegiatan_menunggu_penyerahan' => Kegiatan::where('tahapan', 'dokumentasi-penyerahan')->count(),
                    'total_kegiatan_dikelola' => Kegiatan::count(),
                ];
                $chartData['kegiatan_dibuat'] = $queryKegiatanPerBulan;
                break;

            case 'pengusul':
                $stats = [
                    'proposal_diajukan' => Proposal::where('pengusul_id', $user->id)->count(),
                    'proposal_disetujui' => Proposal::where('pengusul_id', $user->id)->where('status', 'disetujui')->count(),
                    'proposal_ditolak' => Proposal::where('pengusul_id', $user->id)->where('status', 'ditolak')->count(),
                    'proposal_diproses' => Proposal::where('pengusul_id', $user->id)->where('status', 'menunggu')->count(),
                ];
                $chartData['my_proposals'] = Proposal::where('pengusul_id', $user->id)
                    ->selectRaw('MONTH(tanggal_pengajuan) as month, COUNT(*) as count')
                    ->whereYear('tanggal_pengajuan', date('Y'))
                    ->groupBy('month')
                    ->pluck('count', 'month')->toArray();
                break;

            case 'pegawai':
                $stats = [
                    'tugas_aktif' => Kegiatan::where('tahapan', '!=', 'selesai')
                        ->whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                        ->count(),
                    'tugas_selesai' => Kegiatan::where('tahapan', 'selesai')
                        ->whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                        ->count(),
                    'tugas_mendatang' => Kegiatan::whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))->where('tanggal_kegiatan', '>', Carbon::now())->count(),
                    
                ];
                $chartData['my_kegiatan'] = Kegiatan::whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                    ->selectRaw('MONTH(tanggal_kegiatan) as month, COUNT(*) as count')
                    ->whereYear('tanggal_kegiatan', date('Y'))
                    ->groupBy('month')
                    ->pluck('count', 'month')->toArray();
                
                // --- PERBAIKAN: Mengambil data jadwal untuk kalender ---
                $kegiatans = Kegiatan::with('tim')
                    ->whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                    ->get();
                
                $events = $kegiatans->map(function ($kegiatan) {
                    return [
                        'id' => $kegiatan->id,
                        'title' => $kegiatan->nama_kegiatan,
                        'start' => $kegiatan->tanggal_kegiatan,
                        'url' => route('arsip.show', $kegiatan->id),
                        'color' => $kegiatan->tahapan == 'selesai' ? '#10B981' : '#3B82F6',
                        'extendedProps' => [
                            'tim' => $kegiatan->tim->nama_tim ?? 'Tim belum ditentukan',
                            'status' => $kegiatan->tahapan == 'selesai' ? 'Selesai' : 'Aktif',
                        ]
                    ];
                });
                break;
        }
        
        // Format data chart untuk library Chart.js
        $labels = array_map(fn($i) => Carbon::create()->month($i)->format('M'), range(1, 12));

        foreach ($chartData as $key => $data) {
            $formattedData = array_fill(0, 12, 0);
            foreach ($data as $month => $count) {
                if ($month >= 1 && $month <= 12) {
                    $formattedData[$month - 1] = $count;
                }
            }
            $chartData[$key] = [
                'labels' => $labels,
                'data' => $formattedData,
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'events' => $events, // Mengirim data jadwal ke frontend
        ]);
    }
}
