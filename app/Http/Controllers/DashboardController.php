<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard yang disesuaikan dengan peran pengguna.
     */
    public function index()
    {
        $user = Auth::user();
        $stats = [];

        // Kumpulkan statistik berdasarkan peran pengguna
        if ($user->role === 'admin') {
            $stats = [
                'total_proposal' => Proposal::count(),
                'total_kegiatan' => Kegiatan::count(),
                'proposal_menunggu' => Proposal::where('status', 'pending')->count(),
                'kegiatan_berjalan' => Kegiatan::where('tahapan', '!=', 'selesai')->count(),
            ];
        } elseif ($user->role === 'kadis') {
            $stats['proposal_perlu_verifikasi'] = Proposal::where('status', 'pending')->count();
        } elseif ($user->role === 'kabid') {
            $stats['proposal_disetujui'] = Proposal::where('status', 'disetujui')->doesntHave('kegiatan')->count();
            
            // PERBAIKAN: Mengubah query untuk mencari kegiatan berdasarkan user_id di dalam relasi 'tim'.
            // Tabel 'kegiatans' tidak memiliki 'user_id', tetapi tabel 'tims' memilikinya.
            $stats['kegiatan_dibuat'] = Kegiatan::whereHas('tim.users', function ($query) use ($user) {
                $query->where('created_by', $user->id);
            })->count();

        
        } elseif ($user->role === 'pegawai') {
            $stats['tugas_aktif'] = Kegiatan::where('tahapan', '!=', 'selesai')
                ->whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                ->count();
            $stats['tugas_selesai'] = Kegiatan::where('tahapan', 'selesai')
                ->whereHas('tim.users', fn($q) => $q->where('user_id', $user->id))
                ->count();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
