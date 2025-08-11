<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class KontrakResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_kontrak' => $this->nama_kontrak,
            'nomor_kontrak' => $this->nomor_kontrak,
            'tanggal_kontrak' => $this->tanggal_kontrak,
            'nilai_kontrak' => $this->nilai_kontrak,
            'file_path' => $this->file_path,
            'file_url' => $this->file_path ? Storage::url($this->file_path) : null,
            'kegiatan_id' => $this->kegiatan_id, // PERBAIKAN: Ganti dari dokumentasi_kegiatan_id ke kegiatan_id
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // TAMBAHAN: Informasi tambahan yang mungkin berguna
            'file_name' => $this->file_path ? basename($this->file_path) : null,
            'file_size' => $this->file_path && Storage::disk('public')->exists($this->file_path) 
                ? Storage::disk('public')->size($this->file_path) 
                : null,
        ];
    }
}