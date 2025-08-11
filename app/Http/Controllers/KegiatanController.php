<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Proposal;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     * Menampilkan daftar kegiatan dengan eager loading untuk optimasi.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $kegiatans = Kegiatan::with(['proposal', 'tim', 'createdBy'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Kegiatan/Index', [
            'kegiatans' => $kegiatans,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Menampilkan form untuk membuat kegiatan baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Ambil proposal yang sudah disetujui dan belum memiliki kegiatan
        $proposals = Proposal::where('status', 'disetujui')
            ->whereDoesntHave('kegiatan')
            ->get();

        $tims = Tim::all();

        return Inertia::render('Kegiatan/Create', [
            'proposals' => $proposals,
            'tims' => $tims,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Menyimpan kegiatan baru ke database dengan tahapan awal.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $this->validateKegiatanData($request);

        // Upload file SKTL jika ada
        $path = null;
        if ($request->hasFile('sktl_path')) {
            $path = $request->file('sktl_path')->store('sktl', 'public');
        }

        // Prepare data untuk disimpan
        $kegiatanData = $validated;
        $kegiatanData['sktl_path'] = $path;
        $kegiatanData['created_by'] = Auth::id();

        Kegiatan::create($kegiatanData);

        return to_route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified resource.
     * Menampilkan form untuk mengedit kegiatan.
     *
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Inertia\Response
     */
    public function edit(Kegiatan $kegiatan)
    {
        // Ambil proposal yang disetujui, termasuk yang sedang digunakan kegiatan ini
        $proposals = Proposal::where('status', 'disetujui')
            ->orWhere('id', $kegiatan->proposal_id)
            ->get();
            
        $tims = Tim::all();

        return Inertia::render('Kegiatan/Edit', [
            'kegiatan' => $kegiatan,
            'proposals' => $proposals,
            'tims' => $tims,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Memperbarui data kegiatan di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $this->validateKegiatanData($request);

        // Handle file upload SKTL
        $path = $this->handleSKTLUpload($request, $kegiatan);

        // Prepare data untuk update
        $kegiatanData = $validated;
        $kegiatanData['sktl_path'] = $path;

        $kegiatan->update($kegiatanData);

        return to_route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     * Menghapus kegiatan dari database.
     *
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Kegiatan $kegiatan)
    {
        // Hapus file SKTL jika ada
        if ($kegiatan->sktl_path && Storage::disk('public')->exists($kegiatan->sktl_path)) {
            Storage::disk('public')->delete($kegiatan->sktl_path);
        }
        
        $kegiatan->delete();

        return to_route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil dihapus.');
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Validasi data kegiatan untuk create dan update.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    private function validateKegiatanData(Request $request)
    {
        return $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'nullable|string',
            'tanggal_kegiatan' => 'required|date',
            'proposal_id' => 'required|exists:proposals,id',
            'tim_id' => 'required|exists:tims,id',
            'sktl_path' => 'nullable|file',
        ]);
    }

    /**
     * Handle upload file SKTL untuk update kegiatan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return string|null
     */
    private function handleSKTLUpload(Request $request, Kegiatan $kegiatan)
    {
        $path = $kegiatan->sktl_path;

        if ($request->hasFile('sktl_path')) {
            // Hapus file lama jika ada
            if ($kegiatan->sktl_path && Storage::disk('public')->exists($kegiatan->sktl_path)) {
                Storage::disk('public')->delete($kegiatan->sktl_path);
            }
            
            // Upload file baru
            $path = $request->file('sktl_path')->store('sktl', 'public');
        }

        return $path;
    }
}