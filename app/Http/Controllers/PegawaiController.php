<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Enums\TahapanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\StoreBeritaAcaraRequest;
use App\Http\Requests\StoreDokumentasiWithFilesRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Http\Requests\StoreKontrakRequest;

class PegawaiController extends Controller
{
    /**
     * Menampilkan halaman "Kegiatan Saya" untuk pegawai.
     */
    public function myIndex(Request $request)
    {
        $user = Auth::user();
        $query = Kegiatan::with(['tim.users', 'proposal', 'beritaAcara']) // <-- PERBAIKAN
            ->whereHas('tim.users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        $tahapan = $request->query('tahapan');
        if ($tahapan && $tahapan !== 'semua') {
            $query->where('tahapan', $tahapan);
        } else {
            $query->where('tahapan', '!=', 'selesai');
        }
        
        $kegiatans = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Pegawai/KegiatanSaya', [
            'kegiatans' => $kegiatans,
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Menangani konfirmasi kehadiran pegawai.
     */
    public function konfirmasiKehadiran(Request $request, Kegiatan $kegiatan)
    {
        $kegiatan->tahapan = TahapanKegiatan::DOKUMENTASI_OBSERVASI;
        $kegiatan->save();

        return to_route('pegawai.kegiatan.myIndex')->with('success', 'Kehadiran berhasil dikonfirmasi dan kegiatan dimulai.');
    }

    /**
     * Menyimpan dokumentasi observasi.
     * PERBAIKAN: Hanya menyimpan dokumentasi, tidak mengubah tahapan kegiatan.
     */
    public function storeObservasi(StoreDokumentasiWithFilesRequest $request, Kegiatan $kegiatan)
    {
        $validated = $request->validated();

        $dokumentasiData = [
            'nama_dokumentasi' => $validated['nama_dokumentasi'],
            'deskripsi' => $validated['deskripsi'],
            'tipe' => 'observasi',
        ];

        $dokumentasi = $kegiatan->dokumentasi()->create($dokumentasiData);

        // Simpan foto jika ada
        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('dokumentasi/fotos', 'public');
                // PERBAIKAN: Menggunakan nama kolom yang benar 'file_path'
                $dokumentasi->fotos()->create(['file_path' => $path]);
            }
        }

        // ✅ PERBAIKAN: HAPUS/COMMENT BAGIAN INI - Jangan ubah tahapan di sini
        // Setelah dokumentasi observasi disimpan, ubah tahapan ke 'menunggu proses kabid'
        // $kegiatan->update([
        //     'tahapan' => TahapanKegiatan::MENUNGGU_PROSES_KABID,
        // ]);

        return redirect()->back()->with('success', 'Dokumentasi observasi berhasil disimpan.');
    }

    /**
     * TAMBAHAN: Method baru untuk melanjutkan ke tahap berikutnya secara manual
     */
    public function lanjutTahapBerikutnya(Request $request, Kegiatan $kegiatan)
    {
        // Cek apakah dokumentasi observasi sudah ada
        $dokumentasiObservasi = $kegiatan->dokumentasi()->where('tipe', 'observasi')->first();
        
        if (!$dokumentasiObservasi) {
            return redirect()->back()->withErrors(['error' => 'Harap lengkapi dokumentasi observasi terlebih dahulu.']);
        }

        // Update tahapan ke tahap berikutnya
        $kegiatan->update([
            'tahapan' => TahapanKegiatan::MENUNGGU_PROSES_KABID,
        ]);

        return redirect()->back()->with('success', 'Kegiatan berhasil dilanjutkan ke tahap berikutnya.');
    }

    /**
     * Menyimpan dokumentasi penyerahan.
     */
    public function storePenyerahan(Request $request, Kegiatan $kegiatan)
    {
        // Pastikan validasinya sesuai dengan form baru
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'fotos' => 'required|array', // Validasi bahwa 'fotos' adalah array
            'fotos.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048' // Validasi setiap item di dalam array
        ]);

        // Buat dokumentasi kegiatan
        $dokumentasi = $kegiatan->dokumentasi()->create([
            'nama_dokumentasi' => $validated['judul'],
            'tipe' => 'penyerahan', // Tandai sebagai dokumentasi penyerahan
        ]);

        // Simpan setiap foto yang diunggah
        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('dokumentasi_foto', 'public');
                // Sesuaikan nama kolom dengan yang ada di tabel 'fotos'
                $dokumentasi->fotos()->create(['file_path' => $path]); // BENAR
            }
        }

        // Setelah dokumentasi disimpan, lanjutkan tahapan kegiatan
        $kegiatan->update([
            'tahapan' => TahapanKegiatan::PENYELESAIAN, // atau tahapan selanjutnya
        ]);

        return redirect()->back()->with('success', 'Dokumentasi penyerahan berhasil disimpan.');
    }

    /**
     * Menyelesaikan kegiatan dan menyimpan berita acara.
     */
    public function storeBeritaAcara(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'file_berita_acara' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        // Hapus berita acara lama jika ada
        if ($kegiatan->beritaAcara) {
            Storage::disk('public')->delete($kegiatan->beritaAcara->file_path);
            $kegiatan->beritaAcara->delete();
        }

        $filePath = $request->file('file_berita_acara')->store('berita_acara', 'public');

        $kegiatan->beritaAcara()->create([
            'nama_berita_acara' => 'Berita Acara - ' . $kegiatan->nama_kegiatan,
            'file_path' => $filePath,
        ]);

        return redirect()->back()->with('success', 'Berita Acara berhasil diunggah.');
    }

    public function updateStatusAkhir(Request $request, Kegiatan $kegiatan)
    {
        if (!$kegiatan->beritaAcara) {
            return redirect()->back()->withErrors(['status_akhir' => 'Harap unggah Berita Acara terlebih dahulu.']);
        }

        $validated = $request->validate([
            'status_akhir' => ['required', Rule::in(['selesai', 'ditunda', 'dibatalkan'])],
        ]);

        // PERBAIKAN: Pastikan status_akhir disimpan
        $kegiatan->update([
            'status_akhir' => $validated['status_akhir'],
            'tahapan' => TahapanKegiatan::SELESAI,
        ]);

        return redirect()->route('pegawai.kegiatan.myIndex', ['tahapan' => 'selesai'])
            ->with('success', 'Status kegiatan telah diselesaikan.');
    }

    public function uploadPihakKetiga(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'file_pihak_ketiga' => 'required|file|mimes:pdf',
        ]);

        // Hapus file lama jika ada
        if ($kegiatan->file_pihak_ketiga_path && Storage::disk('public')->exists($kegiatan->file_pihak_ketiga_path)) {
            Storage::disk('public')->delete($kegiatan->file_pihak_ketiga_path);
        }

        // Simpan file baru dan dapatkan path-nya
        $filePath = $request->file('file_pihak_ketiga')->store('dokumen_pihak_ketiga', 'public');

        // Update path di database
        $kegiatan->update([
            'file_pihak_ketiga_path' => $filePath,
        ]);

        return redirect()->back()->with('success', 'File pihak ketiga berhasil diunggah.');
    }

    public function storeKebutuhan(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:1',
            'satuan' => 'required|string|max:50',
            'harga_satuan' => 'required|numeric|min:0',
        ]);

        // Cari dokumentasi observasi yang terkait dengan kegiatan ini.
        // Asumsi: dokumentasi observasi sudah dibuat saat pegawai mengisi catatan.
        $dokumentasiObservasi = $kegiatan->dokumentasi()->where('tipe', 'observasi')->first();

        // Jika dokumentasi observasi belum ada, maka buat terlebih dahulu.
        if (!$dokumentasiObservasi) {
             return redirect()->back()->withErrors(['kebutuhan_error' => 'Harap isi dokumentasi observasi utama terlebih dahulu sebelum menambah kebutuhan.']);
        }
        
        // Tambahkan total estimasi ke data yang akan disimpan
        $validated['total'] = $validated['jumlah'] * $validated['harga_satuan'];
        
        $validated['kegiatan_id'] = $kegiatan->id;

        // Simpan kebutuhan ke dokumentasi tersebut
        $dokumentasiObservasi->kebutuhans()->create($validated);

        return redirect()->back()->with('success', 'Data kebutuhan berhasil disimpan.');
    }

    public function storeKontrak(StoreKontrakRequest $request, Kegiatan $kegiatan)
    {
        $validated = $request->validated();

        // Upload file kontrak
        $path = $request->file('dokumen_kontrak')->store('kontrak_pihak_ketiga', 'public');

        // Simpan data kontrak ke database
        $kegiatan->kontrak()->create([
            'nama_kontrak' => $validated['nama_pihak_ketiga'],
            'nomor_kontrak' => $validated['nomor_kontrak'],
            'tanggal_kontrak' => $validated['tanggal_kontrak'],
            'nilai_kontrak' => $validated['nilai_kontrak'] ?? 0,
            'file_path' => $path,
        ]);

        return redirect()->back()->with('success', 'Dokumen Kontrak berhasil disimpan.');
    }
}