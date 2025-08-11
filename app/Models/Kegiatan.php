<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Kegiatan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_kegiatan',
        'ket_kegiatan',
        'tanggal_kegiatan',
        'sktl_path',
        'sktl_penyerahan_path',
        'proposal_id',
        'tim_id',
        'status_kegiatan',
        'status_akhir',
        'tahapan',
        'created_by',
    ];

    /**
     * The accessors to append to the model's array form.
     * Ini adalah kunci agar `sktl_url` dan `sktl_penyerahan_url`
     * selalu ditambahkan saat model diubah menjadi JSON/array untuk dikirim ke frontend.
     *
     * @var array
     */
    protected $appends = ['sktl_url', 'sktl_penyerahan_url'];

    /**
     * Mendefinisikan relasi ke model Proposal.
     */
    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    /**
     * Mendefinisikan relasi ke model Tim.
     */
    public function tim(): BelongsTo
    {
        return $this->belongsTo(Tim::class);
    }

    /**
     * Mendefinisikan relasi ke model DokumentasiKegiatan.
     */
    public function dokumentasi(): HasMany
    {
        return $this->hasMany(DokumentasiKegiatan::class);
    }

    /**
     * Mendefinisikan relasi ke model BeritaAcara.
     */
    public function beritaAcara(): HasOne
    {
        return $this->hasOne(BeritaAcara::class);
    }

    /**
     * Mendefinisikan relasi ke model User (untuk pembuat kegiatan).
     * Relasi ini penting untuk menampilkan kolom "Dibuat Oleh".
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Mendefinisikan relasi ke model Kontrak.
     */
    public function kontrak(): HasOne
    {
        return $this->hasOne(Kontrak::class, 'kegiatan_id');
    }

    /**
     * Accessor untuk mendapatkan URL lengkap dari file SKTL Observasi.
     * Atribut ini (sktl_url) yang dipanggil di file Index.jsx.
     */
    public function getSktlUrlAttribute()
    {
        if ($this->sktl_path && Storage::disk('public')->exists($this->sktl_path)) {
            return Storage::url($this->sktl_path);
        }
        return null;
    }

    /**
     * Accessor untuk mendapatkan URL lengkap dari file SKTL Penyerahan.
     */
    public function getSktlPenyerahanUrlAttribute()
    {
        if ($this->sktl_penyerahan_path && Storage::disk('public')->exists($this->sktl_penyerahan_path)) {
            return Storage::url($this->sktl_penyerahan_path);
        }
        return null;
    }
}
