<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\Response;

class LaporanBeritaController extends Controller
{
    /**
     * Menampilkan halaman formulir untuk membuat laporan.
     */
    public function create()
    {
        return Inertia::render('LaporanBerita/Create');
    }

    /**
     * Memproses data dari form, mengisi template Word, dan mengirimnya sebagai download.
     */
    public function download(Request $request)
    {
        // 1. Validasi input dari form
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string',
            'nomor_dpa' => 'required|string',
            'tanggal' => 'required|date_format:Y-m-d',
            'nama_alat' => 'required|string',
            'dalam_rangka' => 'required|string',
            'nama_kabupaten' => 'required|string',
            'jenis_bantuan' => 'required|string',
            'jumlah_bantuan' => 'required|integer',
            'nama_penerima' => 'required|string',
        ]);

        try {
            // 2. Tentukan path ke file template
            $templatePath = storage_path('app/templates/Laporan_berita.docx');

            if (!file_exists($templatePath)) {
                // Jika template tidak ditemukan, kembalikan error
                return back()->withErrors(['template' => 'File template laporan tidak ditemukan.']);
            }

            // 3. Buat instance TemplateProcessor
            $templateProcessor = new TemplateProcessor($templatePath);

            // 4. Ganti placeholder di template dengan data dari form
            $templateProcessor->setValue('input1', $validated['nama_kegiatan']);
            $templateProcessor->setValue('input2', $validated['nomor_dpa']);
            // Format tanggal ke format Indonesia
            $tanggalFormatted = \Carbon\Carbon::parse($validated['tanggal'])->translatedFormat('d F Y');
            $templateProcessor->setValue('input3', $tanggalFormatted);
            $templateProcessor->setValue('input4', $validated['nama_alat']);
            $templateProcessor->setValue('input5', $validated['dalam_rangka']);
            $templateProcessor->setValue('input6', $validated['nama_kabupaten']);
            $templateProcessor->setValue('input7', $validated['jenis_bantuan']);
            $templateProcessor->setValue('input8', $validated['jumlah_bantuan']);
            $templateProcessor->setValue('input9', $validated['nama_penerima']);

            // Nama file yang akan di-download
            $fileName = 'Laporan Berita - ' . $validated['nama_kegiatan'] . '.docx';

            // 5. Simpan file yang sudah diisi ke path sementara
            $tempPath = storage_path('app/temp/' . $fileName);
            $templateProcessor->saveAs($tempPath);
            
            // 6. Siapkan response untuk download, lalu hapus file sementara
            return Response::download($tempPath)->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            // Tangani jika ada error saat memproses file
            return back()->withErrors(['process' => 'Gagal membuat file laporan: ' . $e->getMessage()]);
        }
    }
}