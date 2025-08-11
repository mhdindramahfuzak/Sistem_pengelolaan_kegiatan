<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Kegiatan;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil semua kegiatan yang melibatkan user, dan muat relasi 'tim'
        $kegiatans = Kegiatan::with('tim')
            ->whereHas('tim.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();
        
        // Format data menjadi format yang dimengerti FullCalendar
        $events = $kegiatans->map(function ($kegiatan) {
            // --- PERBAIKAN ---
            // Menggunakan 'tanggal_kegiatan' sebagai tanggal mulai.
            // Tidak ada tanggal selesai, sehingga acara akan berlangsung seharian.
            return [
                'id' => $kegiatan->id,
                'title' => $kegiatan->nama_kegiatan,
                'start' => $kegiatan->tanggal_kegiatan, 
                // 'end' dihapus agar menjadi acara seharian (all-day event)
                'url' => route('arsip.show', $kegiatan->id), // Arahkan ke halaman detail arsip yang benar
                'color' => $kegiatan->tahapan == 'selesai' ? '#10B981' : '#3B82F6', // Hijau (Selesai), Biru (Aktif)
                'extendedProps' => [
                    // Menambahkan data ekstra untuk ditampilkan di modal
                    'tim' => $kegiatan->tim->nama_tim ?? 'Tim belum ditentukan',
                    'status' => $kegiatan->tahapan == 'selesai' ? 'Selesai' : 'Aktif',
                ]
            ];
        });

        return Inertia::render('Pegawai/JadwalKerja', [
            'events' => $events
        ]);
    }
}
