<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class BeritaAcara extends Model
{
    use HasFactory;

    // PERBAIKAN: Gunakan $fillable untuk memastikan field file_path bisa diisi
    protected $fillable = [
        'kegiatan_id',
        'nama_berita_acara',
        'file_path', // ← Field ini sekarang sudah ditambahkan ke database
        'ket_berita_acara',
        'jumlah_saksi_berita_acara',
        'posisi_peletakan',
        'jumlah',
        'satuan',
        'kedalaman',
    ];

    // ATAU bisa tetap pakai $guarded (lebih simple)
    protected $guarded = ['id'];

    protected $appends = ['file_url'];

    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class);
    }

    /**
     * Get the full URL for the file.
     */
    public function getFileUrlAttribute()
    {
        if ($this->file_path) {
            return Storage::url($this->file_path);
        }
        return null;
    }
}