<?php

namespace App\Enums;

/**
 * Enum untuk merepresentasikan semua tahapan yang mungkin dalam sebuah kegiatan.
 * Ini digunakan untuk mengelola status dan alur kerja kegiatan dari awal hingga akhir.
 */
enum TahapanKegiatan: string
{
    // Tahap awal setelah kegiatan dibuat oleh Kabid.
    // Pegawai yang ditugaskan akan memulai perjalanan dinas.
    case PERJALANAN_DINAS = 'perjalanan_dinas';

    // Tahap setelah pegawai mengonfirmasi kehadiran.
    // Pada tahap ini, pegawai diharapkan mengunggah dokumentasi hasil observasi lapangan.
    case DOKUMENTASI_OBSERVASI = 'dokumentasi_observasi';

    // Tahap setelah pegawai selesai melakukan observasi.
    // Sistem menunggu Kabid untuk menindaklanjuti dengan mengunggah SKTL Penyerahan.
    case MENUNGGU_PROSES_KABID = 'menunggu_proses_kabid';

    // Tahap setelah Kabid memproses dan mengunggah SKTL Penyerahan.
    // Pada tahap ini, pegawai diharapkan mengunggah dokumentasi hasil penyerahan bantuan.
    case DOKUMENTASI_PENYERAHAN = 'dokumentasi_penyerahan';

    // Tahap setelah pegawai selesai mendokumentasikan penyerahan.
    // Pada tahap ini, pegawai diharapkan mengunggah Berita Acara untuk menyelesaikan kegiatan.
    case PENYELESAIAN = 'penyelesaian';

    // Tahap akhir dari sebuah kegiatan.
    // Semua dokumentasi telah lengkap dan kegiatan dianggap selesai.
    case SELESAI = 'selesai';
}
