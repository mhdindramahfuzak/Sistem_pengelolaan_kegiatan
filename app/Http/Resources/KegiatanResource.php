<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'sktl_url' => $this->sktl_url,
            'sktl_penyerahan_path' => $this->sktl_penyerahan_path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'tim' => new TimResource($this->whenLoaded('tim')),
            'proposal' => new ProposalResource($this->whenLoaded('proposal')),
            'dokumentasi' => DokumentasikegiatanResource::collection($this->whenLoaded('dokumentasi')),
            'berita_acara' => new BeritaAcaraResource($this->whenLoaded('beritaAcara')),
            'kontrak' => new KontrakResource($this->whenLoaded('kontrak')),
        ];
    }
}