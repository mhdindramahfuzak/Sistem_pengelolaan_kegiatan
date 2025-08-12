<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TimController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ArsipController;
use App\Http\Controllers\VerifikasiProposalController;
use App\Http\Controllers\ManajemenPenyerahanController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\LandingPageController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return redirect()->route('login');
// });

Route::get('/', [LandingPageController::class, 'index'])->name('landing');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Rute untuk Semua Peran yang Terotentikasi ---
    Route::get('/arsip', [ArsipController::class, 'index'])->name('arsip.index');
    Route::get('/arsip/{kegiatan}', [ArsipController::class, 'show'])->name('arsip.show');

    // --- Rute untuk Role: Pengusul ---
    Route::middleware(['role:pengusul|admin'])->group(function () {
        Route::get('/proposal-saya', [ProposalController::class, 'myProposals'])->name('proposal.myIndex');
        Route::get('/proposal/create', [ProposalController::class, 'create'])->name('proposal.create');
        Route::post('/proposal', [ProposalController::class, 'store'])->name('proposal.store');
    });

    // --- Rute Bersama untuk Kadis, Kabid & Admin ---
    Route::middleware(['role:kadis|kabid|admin'])->group(function() {
        Route::get('/proposal-disetujui', [ProposalController::class, 'approvedIndex'])->name('kabid.proposal.index');
    });

    // --- Rute untuk Role: Kadis ---
    Route::middleware(['role:kadis|admin'])->group(function () {
        Route::get('/verifikasi-proposal', [VerifikasiProposalController::class, 'index'])->name('verifikasi.proposal.index');
        Route::patch('/verifikasi-proposal/{proposal}', [VerifikasiProposalController::class, 'update'])->name('verifikasi.proposal.update');
    });

    // --- Rute untuk Role: Kabid & Admin ---
    Route::middleware(['role:kabid|admin'])->group(function () {
        Route::resource('tim', TimController::class);
        Route::resource('kegiatan', KegiatanController::class);
        Route::get('/manajemen-penyerahan', [ManajemenPenyerahanController::class, 'index'])->name('manajemen.penyerahan.index');
        Route::patch('/manajemen-penyerahan/{kegiatan}', [ManajemenPenyerahanController::class, 'update'])->name('manajemen.penyerahan.update');
    });
    
    // --- Rute KHUSUS untuk Role: Pegawai ---
    Route::middleware(['role:pegawai|admin'])->group(function () {
        Route::get('/kegiatan-saya', [PegawaiController::class, 'myIndex'])->name('pegawai.kegiatan.myIndex');
        Route::post('/kegiatan/{kegiatan}/konfirmasi-kehadiran', [PegawaiController::class, 'konfirmasiKehadiran'])->name('pegawai.kegiatan.confirmKehadiran');
        Route::post('/dokumentasi-observasi/{kegiatan}', [PegawaiController::class, 'storeObservasi'])->name('pegawai.kegiatan.storeObservasi');
        Route::post('/kegiatan/{kegiatan}/lanjut-tahap-berikutnya', [PegawaiController::class, 'lanjutTahapBerikutnya'])->name('pegawai.kegiatan.lanjutTahapBerikutnya');
        Route::post('/dokumentasi-penyerahan/{kegiatan}', [PegawaiController::class, 'storePenyerahan'])->name('pegawai.kegiatan.storePenyerahan');
        Route::post('/penyelesaian/{kegiatan}', [PegawaiController::class, 'storeBeritaAcara'])->name('pegawai.kegiatan.storeBeritaAcara');
        Route::patch('/penyelesaian/{kegiatan}/status-akhir', [PegawaiController::class, 'updateStatusAkhir'])->name('pegawai.kegiatan.updateStatusAkhir');
        Route::post('/kegiatan/{kegiatan}/upload-pihak-ketiga', [PegawaiController::class, 'uploadPihakKetiga'])->name('pegawai.kegiatan.uploadPihakKetiga');
        Route::post('/kegiatan/{kegiatan}/kebutuhan', [PegawaiController::class, 'storeKebutuhan'])->name('pegawai.kegiatan.storeKebutuhan');
        Route::post('/kegiatan/{kegiatan}/kontrak', [PegawaiController::class, 'storeKontrak'])->name('pegawai.kegiatan.storeKontrak');

        // Rute baru untuk  Jadwal Kerja
        Route::get('/jadwal-kerja', [JadwalController::class, 'index'])->name('jadwal.index');

        Route::get('/laporan-berita/create', [\App\Http\Controllers\LaporanBeritaController::class, 'create'])->name('laporan-berita.create');
        Route::post('/laporan-berita/download', [\App\Http\Controllers\LaporanBeritaController::class, 'download'])->name('laporan-berita.download');
    });
    

    // --- Rute KHUSUS Admin ---
    Route::middleware(['role:admin'])->group(function() {
        Route::resource('user', UserController::class);
        Route::resource('proposal', ProposalController::class)->except(['create', 'store']);
    });
});

require __DIR__.'/auth.php';

