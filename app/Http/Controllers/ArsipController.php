<?php

namespace App\Http\Controllers;

use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use Inertia\Inertia;

class ArsipController extends Controller
{
    /**
     * Menampilkan daftar kegiatan yang sudah diarsipkan (selesai).
     */
    public function index()
    {
        // Query ini sudah benar, tidak perlu diubah.
        $kegiatans = Kegiatan::query()
            ->where('tahapan', 'selesai')
            ->with(['proposal', 'tim']) // Memuat relasi dasar untuk daftar
            ->latest('updated_at')
            ->paginate(10);

        return Inertia::render('Arsip/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Menampilkan detail lengkap dari satu kegiatan yang diarsipkan.
     *
     * @param \App\Models\Kegiatan $kegiatan
     * @return \Inertia\Response
     */
    public function show(Kegiatan $kegiatan)
    {
        // === PERBAIKAN UTAMA DI SINI ===
        // Kita memuat semua relasi yang dibutuhkan oleh halaman Show.jsx secara spesifik.
        // Termasuk relasi di dalam relasi (nested), seperti 'fotos' di dalam 'dokumentasi'.
        $kegiatan->load([
            'proposal.pengusul',
            'tim.users',
            'dokumentasi' => function ($query) {
                // Ini penting: memuat foto dan kebutuhan DARI setiap entri dokumentasi
                $query->with(['fotos', 'kebutuhans']);
            },
            'beritaAcara',
            'kontrak',
        ]);

        return Inertia::render('Arsip/Show', [
            // Menggunakan KegiatanResource untuk memformat data sebelum dikirim
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }
}