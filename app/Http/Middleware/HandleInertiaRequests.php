<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Proposal;
use App\Models\Kegiatan;
use App\Models\User; // Pastikan model User di-import

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                // Perbaikan: Ganti nama 'permissions' menjadi 'can' agar konsisten dengan frontend
                // dan kirim $request->user() sebagai argumen, bukan $request
                'can' => $request->user() ? $this->getUserPermissions($request->user()) : null,
            ],
            // Menambahkan kembali flash messages agar notifikasi berfungsi
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Mengembalikan array hak akses untuk pengguna yang terotentikasi.
     *
     * @param \App\Models\User $user
     * @return array<string, bool>
     */
    protected function getUserPermissions(User $user): array
    {
        // Parameter diubah menjadi User $user untuk type-hinting yang benar
        return [
            'create_proposal' => $user->can('create', Proposal::class),
            'verify_proposal' => $user->can('update', Proposal::class),
            'create_kegiatan' => $user->can('create', Kegiatan::class),
            'manage_penyerahan' => $user->can('create', Kegiatan::class),
        ];
    }
}
