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
     * Helper untuk mendapatkan teks tampilan status berdasarkan tahapan.
     */
    private function getStatusDisplay($tahapan)
    {
        $statusMap = [
            'perjalanan_dinas' => 'Perjalanan Dinas',
            'dokumentasi_observasi' => 'Observasi Lapangan',
            'menunggu_proses_kabid' => 'Proses oleh Kabid',
            'dokumentasi_penyerahan' => 'Dokumentasi Penyerahan',
            'penyelesaian' => 'Penyelesaian',
            'selesai' => 'Selesai',
        ];
        return $statusMap[$tahapan] ?? 'Dalam Proses';
    }

    /**
     * Helper untuk mendapatkan warna status berdasarkan tahapan.
     */
    private function getStatusColor($tahapan)
    {
        $colorMap = [
            'perjalanan_dinas' => 'blue',
            'dokumentasi_observasi' => 'yellow',
            'menunggu_proses_kabid' => 'orange',
            'dokumentasi_penyerahan' => 'purple',
            'penyelesaian' => 'indigo',
            'selesai' => 'green',
        ];
        return $colorMap[$tahapan] ?? 'gray';
    }

    /**
     * Menampilkan dashboard yang disesuaikan dengan peran pengguna.
     */
    public function index()
    {
        $user = Auth::user();
        $stats = [];
        $chartData = [];
        $events = [];
        $statusKegiatan = []; 

        // Data grafik umum
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
                // Logika untuk admin...
                break;

            case 'kadis':
            case 'kabid': // Menggabungkan logika untuk Kadis dan Kabid
                if ($user->role === 'kadis') {
                    $stats = [
                        'proposal_perlu_verifikasi' => Proposal::where('status', 'diajukan')->count(),
                        'proposal_sudah_diverifikasi' => Proposal::whereIn('status', ['disetujui', 'ditolak'])->count(),
                        'total_kegiatan_berjalan' => Kegiatan::where('tahapan', '!=', 'selesai')->count(),
                        'total_arsip' => Kegiatan::where('tahapan', 'selesai')->count(),
                    ];
                } else { // kabid
                    $stats = [
                        'proposal_siap_dibuat_kegiatan' => Proposal::where('status', 'disetujui')->doesntHave('kegiatan')->count(),
                        'total_tim_dibentuk' => Tim::count(),
                        'kegiatan_menunggu_penyerahan' => Kegiatan::where('tahapan', 'dokumentasi-penyerahan')->count(),
                        'total_kegiatan_dikelola' => Kegiatan::count(),
                    ];
                }

                // Ambil status kegiatan terbaru untuk Kadis & Kabid
                $statusKegiatan = Kegiatan::with(['proposal.pengusul', 'tim'])
                    ->where('tahapan', '!=', 'selesai')
                    ->orderBy('tanggal_kegiatan', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($kegiatan) {
                        return [
                            'id' => $kegiatan->id,
                            'nama_kegiatan' => $kegiatan->nama_kegiatan,
                            'tahapan' => $kegiatan->tahapan,
                            'tanggal_kegiatan' => $kegiatan->tanggal_kegiatan,
                            'pengusul' => $kegiatan->proposal->pengusul->name ?? 'N/A',
                            'tim' => $kegiatan->tim->nama_tim ?? 'N/A',
                            'status_display' => $this->getStatusDisplay($kegiatan->tahapan),
                            'color' => $this->getStatusColor($kegiatan->tahapan),
                        ];
                    });
                break;
            
            // case 'pegawai', 'pengusul', etc.
        }

        // Format data chart agar konsisten
        $formattedChartData = [];
        foreach ($chartData as $key => $data) {
            $labels = [];
            $values = [];
            for ($m = 1; $m <= 12; $m++) {
                $labels[] = Carbon::create()->month($m)->format('M');
                $values[] = $data[$m] ?? 0;
            }
            $formattedChartData[$key] = ['labels' => $labels, 'data' => $values];
        }

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'chartData' => $formattedChartData,
            'events' => $events,
            'statusKegiatan' => $statusKegiatan,
        ]);
    }
}
