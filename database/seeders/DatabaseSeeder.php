<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role; // 1. Import model Role

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 2. Reset cache peran dan izin
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 3. Buat semua peran yang dibutuhkan
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'kadis']);
        Role::create(['name' => 'kabid']);
        Role::create(['name' => 'pegawai']);
        Role::create(['name' => 'pengusul']);

        // 4. Buat pengguna dan langsung tugaskan perannya

        // Membuat User dengan peran Admin
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'no_hp' => '081234567890',
        ]);
        $admin->assignRole('admin');

        // Membuat User dengan peran Kadis
        $kadis = User::factory()->create([
            'name' => 'Kepala Dinas',
            'email' => 'kadis@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'kadis',
            'no_hp' => '081234567891',
        ]);
        $kadis->assignRole('kadis');

        // Membuat User dengan peran Kabid
        $kabid = User::factory()->create([
            'name' => 'Kepala Bidang',
            'email' => 'kabid@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'kabid',
            'no_hp' => '081234567892',
        ]);
        $kabid->assignRole('kabid');

        // Membuat User dengan peran Pegawai
        $pegawai = User::factory()->create([
            'name' => 'Pegawai User',
            'email' => 'pegawai@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'pegawai',
            'no_hp' => '9432948324987',
        ]);
        $pegawai->assignRole('pegawai');

        // Membuat User dengan peran Pengusul
        $pengusul = User::factory()->create([
            'name' => 'Pengusul User',
            'email' => 'pengusul@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'pengusul',
            'no_hp' => '9083902183912',
        ]);
        $pengusul->assignRole('pengusul');
    }
}