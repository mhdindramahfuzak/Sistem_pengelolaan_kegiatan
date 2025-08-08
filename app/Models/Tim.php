<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tim extends Model
{
    use HasFactory;

    protected $fillable = ['nama_tim', 'ketua_tim_id'];

    /**
     * Mendefinisikan relasi many-to-many ke model User.
     * Ini adalah relasi yang hilang dan menyebabkan error.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        // Argumen kedua adalah nama tabel pivot (junction table).
        return $this->belongsToMany(User::class, 'pegawai_tim');
    }

    /**
     * Relasi untuk mendapatkan daftar kegiatan yang ditangani oleh tim ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function kegiatans(): HasMany
    {
        return $this->hasMany(Kegiatan::class);
    }
}
