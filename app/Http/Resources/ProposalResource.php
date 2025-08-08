<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProposalResource extends JsonResource
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
            'nama_proposal' => $this->nama_proposal,
            'deskripsi' => $this->deskripsi,
            'tujuan' => $this->tujuan,
            'dokumen_path' => $this->dokumen_path,
            'status' => $this->status,
            'tanggal_pengajuan' => (new \DateTime($this->tanggal_pengajuan))->format('d-m-Y'),
            'alasan_penolakan' => $this->alasan_penolakan,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y H:i:s'),
            'pengusul' => $this->whenLoaded('pengusul', function () {
                return new UserResource($this->pengusul);
            }),
            'dokumen_url' => $this->dokumen_path ? Storage::url($this->dokumen_path) : null,
        ];
    }
}
