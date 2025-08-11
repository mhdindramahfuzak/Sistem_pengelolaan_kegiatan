<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class KegiatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'nama_kegiatan' => $this->nama_kegiatan,
            'ket_kegiatan' => $this->ket_kegiatan,
            'tanggal_kegiatan' => $this->tanggal_kegiatan,
            'status_akhir' => $this->status_akhir,
            'created_at' => $this->created_at->format('d-m-Y'),
            'updated_at' => $this->updated_at->format('d-m-Y'),

            // === PERBAIKAN URL FILE DI SINI ===
            // Menggunakan Storage::url() untuk menghasilkan URL yang benar
            'sktl_url' => $this->sktl_path ? Storage::url($this->sktl_path) : null,
            'sktl_penyerahan_url' => $this->sktl_penyerahan_path ? Storage::url($this->sktl_penyerahan_path) : null,

            // === MEMASTIKAN SEMUA RELASI DISERTAKAN ===
            'tim' => new TimResource($this->whenLoaded('tim')),
            'proposal' => new ProposalResource($this->whenLoaded('proposal')),
            // PERBAIKAN: Gunakan resource yang benar untuk dokumentasi
            'dokumentasi' => DokumentasiKegiatanResource::collection($this->whenLoaded('dokumentasi')),
            'berita_acara' => new BeritaAcaraResource($this->whenLoaded('beritaAcara')),
            'kontrak' => new KontrakResource($this->whenLoaded('kontrak')),
        ];
    }
}