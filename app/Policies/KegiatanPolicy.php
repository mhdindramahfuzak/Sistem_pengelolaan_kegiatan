<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KegiatanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * PERBAIKAN: Menambahkan metode baru untuk halaman "Kegiatan Saya".
     * Metode ini secara eksplisit memberikan izin kepada 'pegawai'
     * untuk mengakses halaman daftar tugas mereka.
     */
    public function viewMyIndex(User $user): bool
    {
        return $user->hasRole('pegawai');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        // 1. Izinkan admin atau kabid
        if ($user->hasRole(['admin', 'kabid'])) {
            return true;
        }

        // 2. Izinkan pegawai jika mereka adalah anggota tim dari kegiatan ini
        if ($user->hasRole('pegawai')) {
            return $kegiatan->tim && $kegiatan->tim->pegawais->contains($user);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('kabid');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('pegawai');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('admin');
    }
}
