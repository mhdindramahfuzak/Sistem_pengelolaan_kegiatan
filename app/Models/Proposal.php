<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; // <-- Tambahkan ini

class Proposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_proposal',
        'deskripsi',
        'tujuan',
        'dokumen_path',
        'status',
        'tanggal_pengajuan',
        'alasan_penolakan',
        'pengusul_id',
    ];

    public function pengusul(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengusul_id');
    }

    /**
     * PERBAIKAN: Menambahkan relasi ke Kegiatan.
     * Sebuah proposal memiliki satu kegiatan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function kegiatan(): HasOne
    {
        return $this->hasOne(Kegiatan::class);
    }
}
