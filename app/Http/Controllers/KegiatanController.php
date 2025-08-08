<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKegiatanRequest;
use App\Http\Requests\UpdateKegiatanRequest;
use App\Http\Resources\KegiatanResource;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\TimResource;
use App\Models\Kegiatan;
use App\Models\Proposal;
use App\Models\Tim;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // --- PERBAIKAN DI SINI ---
        // Menambahkan with(['proposal', 'tim', 'createdBy']) untuk memuat semua data relasi
        // yang dibutuhkan oleh halaman Index.jsx.
        $query = Kegiatan::with(['proposal', 'tim', 'createdBy']);

        // Logika filter dan pencarian
        if (request("nama_kegiatan")) {
            $query->where("nama_kegiatan", "like", "%" . request("nama_kegiatan") . "%");
        }

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");
        
        $kegiatans = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return Inertia::render('Kegiatan/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $proposals = Proposal::where('status', 'disetujui')->get();
        $tims = Tim::with('users')->get();
        return Inertia::render('Kegiatan/Create', [
            'proposals' => ProposalResource::collection($proposals),
            'tims' => TimResource::collection($tims),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKegiatanRequest $request)
    {
        $data = $request->validated();
        
        // --- PERBAIKAN DI SINI ---
        // Mengubah 'user_id' menjadi 'created_by' agar sesuai dengan nama kolom di database.
        $data['created_by'] = Auth::id();

        if ($request->hasFile('sktl_path')) {
            $data['sktl_path'] = $request->file('sktl_path')->store('sktl', 'public');
        }

        Kegiatan::create($data);

        // Arahkan ke halaman manajemen kegiatan setelah berhasil
        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dibuat.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Kegiatan $kegiatan)
    {
        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kegiatan $kegiatan)
    {
        $proposals = Proposal::where('status', 'disetujui')->get();
        $tims = Tim::with('users')->get();
        return Inertia::render('Kegiatan/Edit', [
            'kegiatan' => new KegiatanResource($kegiatan),
            'proposals' => ProposalResource::collection($proposals),
            'tims' => TimResource::collection($tims),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan)
    {
        $data = $request->validated();
        // Logika update
        // ...
        $kegiatan->update($data);
        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kegiatan $kegiatan)
    {
        $kegiatan->delete();
        // Hapus file terkait jika ada
        // ...
        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dihapus.');
    }
}
