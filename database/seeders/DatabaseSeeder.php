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
            'email' => 'admindiskp@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'no_hp' => '081234567890',
        ]);
        $admin->assignRole('admin');

        // Membuat User dengan peran Kadis - Hamdan
        $kadis = User::factory()->create([
            'name' => 'Hamdan',
            'email' => 'hamdandiskp@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'kadis',
            'no_hp' => '081234567891',
        ]);
        $kadis->assignRole('kadis');

        // Membuat User dengan peran Kabid - Jenny
        $kabid = User::factory()->create([
            'name' => 'Jenny',
            'email' => 'jennydiskp@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'kabid',
            'no_hp' => '081234567892',
        ]);
        $kabid->assignRole('kabid');

        // Membuat User dengan peran Pegawai
        $pegawaiData = [
            ['name' => 'Khudri', 'email' => 'khudridiskp@gmail.com'],
            ['name' => 'Zulfan', 'email' => 'zulfandiskp@gmail.com'],
            ['name' => 'Siti Mimi', 'email' => 'sitimimidiskp@gmail.com'],
            ['name' => 'Carles', 'email' => 'carlesdiskp@gmail.com'],
            ['name' => 'Hemat', 'email' => 'hematdiskp@gmail.com'],
            ['name' => 'Fahmi', 'email' => 'fahmidiskp@gmail.com'],
            ['name' => 'Putri', 'email' => 'putridiskp@gmail.com'],
            ['name' => 'Andi', 'email' => 'andidiskp@gmail.com'],
            ['name' => 'Efa', 'email' => 'efadiskp@gmail.com'],
            ['name' => 'Nurul', 'email' => 'nuruldiskp@gmail.com'],
            ['name' => 'Lidia', 'email' => 'lidiadiskp@gmail.com'],
        ];

        foreach ($pegawaiData as $index => $data) {
            $pegawai = User::factory()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'pegawai',
                'no_hp' => '0812345670' . str_pad($index + 1, 2, '0', STR_PAD_LEFT),
            ]);
            $pegawai->assignRole('pegawai');
        }

        // Membuat User dengan peran Pengusul per Kabupaten
        $pengusulData = [
            ['name' => 'Pengusul Asahan', 'email' => 'pengusulasakandiskp@gmail.com', 'kota' => 'Kisaran'],
            ['name' => 'Pengusul Batubara', 'email' => 'pengusulbatubaradiskp@gmail.com', 'kota' => 'Limapuluh'],
            ['name' => 'Pengusul Dairi', 'email' => 'pengusuldairidiskp@gmail.com', 'kota' => 'Sidikalang'],
            ['name' => 'Pengusul Deli Serdang', 'email' => 'pengusuldeliserdangdiskp@gmail.com', 'kota' => 'Lubuk Pakam'],
            ['name' => 'Pengusul Humbang Hasundutan', 'email' => 'pengusulhumbanghasundutandiskp@gmail.com', 'kota' => 'Doloksanggul'],
            ['name' => 'Pengusul Karo', 'email' => 'pengusulkarodiskp@gmail.com', 'kota' => 'Kabanjahe'],
            ['name' => 'Pengusul Labuhan Batu', 'email' => 'pengusullabuhanbatudiskp@gmail.com', 'kota' => 'Rantauprapat'],
            ['name' => 'Pengusul Labuhan Batu Selatan', 'email' => 'pengusullabuhanbatuselatandiskp@gmail.com', 'kota' => 'Kotapinang'],
            ['name' => 'Pengusul Labuhan Batu Utara', 'email' => 'pengusullabuhanbatuutaradiskp@gmail.com', 'kota' => 'Aek Kanopan'],
            ['name' => 'Pengusul Langkat', 'email' => 'pengusullangkatdiskp@gmail.com', 'kota' => 'Stabat'],
            ['name' => 'Pengusul Mandailing Natal', 'email' => 'pengusulmandailingnataldiskp@gmail.com', 'kota' => 'Panyabungan'],
            ['name' => 'Pengusul Nias', 'email' => 'pengusulniasdiskp@gmail.com', 'kota' => 'Gunungsitoli'],
            ['name' => 'Pengusul Nias Barat', 'email' => 'pengusulniasbaratdiskp@gmail.com', 'kota' => 'Sukabumi'],
            ['name' => 'Pengusul Nias Selatan', 'email' => 'pengusulniasselatandiskp@gmail.com', 'kota' => 'Telukdalam'],
            ['name' => 'Pengusul Nias Utara', 'email' => 'pengusulniasutaradiskp@gmail.com', 'kota' => 'Lotu'],
            ['name' => 'Pengusul Padang Lawas', 'email' => 'pengusulpadanglawasdiskp@gmail.com', 'kota' => 'Sibuhuan'],
            ['name' => 'Pengusul Padang Lawas Utara', 'email' => 'pengusulpadanglawasutaradiskp@gmail.com', 'kota' => 'Gunung Tua'],
            ['name' => 'Pengusul Pematang Siantar', 'email' => 'pengusulpematangsiandiskp@gmail.com', 'kota' => 'Pematang Siantar'],
            ['name' => 'Pengusul Simalungun', 'email' => 'pengusulsimalungundiskp@gmail.com', 'kota' => 'Raya Simalungun'],
            ['name' => 'Pengusul Sibolga', 'email' => 'pengusulsibolgadiskp@gmail.com', 'kota' => 'Sibolga'],
            ['name' => 'Pengusul Tanjung Balai', 'email' => 'pengusultanjungbalaidiskp@gmail.com', 'kota' => 'Tanjung Balai'],
            ['name' => 'Pengusul Tebing Tinggi', 'email' => 'pengusultebingtinggidiskp@gmail.com', 'kota' => 'Tebing Tinggi'],
            ['name' => 'Pengusul Serdang Bedagai', 'email' => 'pengusulserdangbedagaidiskp@gmail.com', 'kota' => 'Sei Rampah'],
            ['name' => 'Pengusul Samosir', 'email' => 'pengusulsamosirdiskp@gmail.com', 'kota' => 'Pangururan'],
            ['name' => 'Pengusul Kota Medan', 'email' => 'pengusulkotamedandiskp@gmail.com', 'kota' => 'Medan'],
        ];

        foreach ($pengusulData as $index => $data) {
            $pengusul = User::factory()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'pengusul',
                'no_hp' => '0813456' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
            ]);
            $pengusul->assignRole('pengusul');
        }
    }
}