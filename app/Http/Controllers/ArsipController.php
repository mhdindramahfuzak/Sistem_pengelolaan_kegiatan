<?php

namespace App\Http\Controllers;

use App\Http\Resources\KegiatanResource;
use App\Http\Resources\KegiatanDetailResource;
use App\Models\Kegiatan;
use Inertia\Inertia;

class ArsipController extends Controller
{
    /**
     * Menampilkan daftar kegiatan yang sudah diarsipkan (selesai).
     */
    public function index()
    {
        $kegiatans = Kegiatan::where('tahapan', 'selesai')
            ->with('proposal', 'tim')
            ->latest('updated_at')
            ->paginate(10);

        return Inertia::render('Arsip/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
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
            // PERBAIKAN UTAMA DI SINI:
            // Hapus query manual `where('uuid', $id)` karena Laravel sudah
            // secara otomatis menemukan kegiatan berdasarkan 'id' melalui Route Model Binding.
            // Cukup muat relasi yang dibutuhkan saja.
            $kegiatan->load([
                'proposal.pengusul',
                'tim.users',
                'createdBy',
                'kontrak', 
                'dokumentasi' => function ($query) {
                    $query->with(['fotos', 'kebutuhans']);
                },
                'beritaAcara'
            ]);

            return Inertia::render('Arsip/Show', [
                // Langsung gunakan objek $kegiatan yang sudah ditemukan oleh Laravel
                'kegiatan' => new KegiatanResource($kegiatan),
            ]);
        }
}
