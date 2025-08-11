<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Proposal;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // --- PERBAIKAN UTAMA ---
        // Menambahkan 'createdBy' ke dalam with() untuk melakukan eager loading.
        // Ini akan mengambil data pengguna yang berelasi (pembuat kegiatan)
        // dalam satu query efisien untuk ditampilkan di tabel.
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
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Mengambil proposal yang sudah disetujui dan belum memiliki kegiatan
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'nullable|string',
            'tanggal_kegiatan' => 'required|date',
            'proposal_id' => 'required|exists:proposals,id',
            'tim_id' => 'required|exists:tims,id',
            'sktl_path' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('sktl_path')) {
            $path = $request->file('sktl_path')->store('sktl', 'public');
        }

        $kegiatanData = $validated;
        $kegiatanData['sktl_path'] = $path;
        $kegiatanData['created_by'] = Auth::id(); // Mengisi created_by dengan ID user yang login

        Kegiatan::create($kegiatanData);

        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Inertia\Response
     */
    public function edit(Kegiatan $kegiatan)
    {
        // Mengambil semua proposal yang disetujui, termasuk yang sedang digunakan oleh kegiatan ini
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'nullable|string',
            'tanggal_kegiatan' => 'required|date',
            'proposal_id' => 'required|exists:proposals,id',
            'tim_id' => 'required|exists:tims,id',
            'sktl_path' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $path = $kegiatan->sktl_path;
        if ($request->hasFile('sktl_path')) {
            // Hapus file lama jika ada
            if ($kegiatan->sktl_path) {
                Storage::disk('public')->delete($kegiatan->sktl_path);
            }
            $path = $request->file('sktl_path')->store('sktl', 'public');
        }

        $kegiatanData = $validated;
        $kegiatanData['sktl_path'] = $path;

        $kegiatan->update($kegiatanData);

        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Kegiatan  $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Kegiatan $kegiatan)
    {
        // Hapus file SKTL jika ada
        if ($kegiatan->sktl_path) {
            Storage::disk('public')->delete($kegiatan->sktl_path);
        }
        
        $kegiatan->delete();

        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dihapus.');
    }
}
