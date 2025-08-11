<?php

namespace App\Http\Controllers;

use App\Enums\TahapanKegiatan;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ManajemenPenyerahanController extends Controller
{
    /**
     * Menampilkan daftar kegiatan yang menunggu proses penyerahan oleh Kabid.
     */
    public function index()
    {
        // Ambil semua kegiatan yang statusnya MENUNGGU_PROSES_KABID
        $kegiatans = Kegiatan::query()
            ->where('tahapan', TahapanKegiatan::MENUNGGU_PROSES_KABID)
            ->with('tim.users', 'proposal') // Eager load relasi untuk efisiensi
            ->orderBy('tanggal_kegiatan', 'desc')
            ->paginate(10);

        return inertia('Kegiatan/IndexPenyerahan', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
        ]);
    }

    /**
     * Memproses penyerahan oleh Kabid dan melanjutkan tahapan kegiatan.
     */
    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'tanggal_penyerahan' => 'required|date',
            'file_sktl' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Hapus file SKTL lama jika ada
        if ($kegiatan->sktl_penyerahan_path && Storage::disk('public')->exists($kegiatan->sktl_penyerahan_path)) {
            Storage::disk('public')->delete($kegiatan->sktl_penyerahan_path);
        }

        // Simpan file SKTL penyerahan (PERBAIKAN)
        $filePath = $request->file('file_sktl')->store('sktl_penyerahan', 'public');

        // Update data pada tabel kegiatan
        $kegiatan->update([
            'tanggal_penyerahan' => $validated['tanggal_penyerahan'],
            'sktl_penyerahan_path' => $filePath, // PERBAIKAN: simpan ke field yang benar
            'tahapan' => TahapanKegiatan::DOKUMENTASI_PENYERAHAN,
        ]);

        return redirect()->route('manajemen.penyerahan.index')
            ->with('success', 'Kegiatan berhasil diproses dan dilanjutkan ke tahap penyerahan.');
    }
}
