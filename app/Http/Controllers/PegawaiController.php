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
    // ==================== MAIN VIEWS & NAVIGATION ====================

    /**
     * Menampilkan halaman "Kegiatan Saya" untuk pegawai.
     * Filter berdasarkan tahapan kegiatan yang dipilih.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function myIndex(Request $request)
    {
        $user = Auth::user();
        
        $query = Kegiatan::with(['tim.users', 'proposal', 'beritaAcara'])
            ->whereHas('tim.users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        // Filter berdasarkan tahapan
        $tahapan = $request->query('tahapan');
        if ($tahapan && $tahapan !== 'semua') {
            $query->where('tahapan', $tahapan);
        } else {
            // Default: tampilkan semua kecuali yang sudah selesai
            $query->where('tahapan', '!=', 'selesai');
        }
        
        $kegiatans = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Pegawai/KegiatanSaya', [
            'kegiatans' => $kegiatans,
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
        ]);
    }

    // ==================== TAHAP 1: PERJALANAN DINAS ====================

    /**
     * Konfirmasi kehadiran pegawai - Memulai tahap dokumentasi observasi.
     * TAHAP: PERJALANAN_DINAS → DOKUMENTASI_OBSERVASI
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function konfirmasiKehadiran(Request $request, Kegiatan $kegiatan)
    {
        $kegiatan->update([
            'tahapan' => TahapanKegiatan::DOKUMENTASI_OBSERVASI
        ]);

        return to_route('pegawai.kegiatan.myIndex')
            ->with('success', 'Kehadiran berhasil dikonfirmasi. Silakan mulai dokumentasi observasi.');
    }

    // ==================== TAHAP 2: DOKUMENTASI OBSERVASI ====================

    /**
     * Menyimpan dokumentasi observasi lapangan.
     * CATATAN: Tahapan tidak berubah otomatis, perlu konfirmasi manual.
     *
     * @param StoreDokumentasiWithFilesRequest $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeObservasi(StoreDokumentasiWithFilesRequest $request, Kegiatan $kegiatan)
    {
        $validated = $request->validated();

        // Buat dokumentasi observasi
        $dokumentasi = $kegiatan->dokumentasi()->create([
            'nama_dokumentasi' => $validated['nama_dokumentasi'],
            'deskripsi' => $validated['deskripsi'],
            'tipe' => 'observasi',
        ]);

        // Simpan foto-foto dokumentasi
        $this->saveDokumentasiFotos($request, $dokumentasi);

        return redirect()->back()
            ->with('success', 'Dokumentasi observasi berhasil disimpan.');
    }

    /**
     * Menyimpan data kebutuhan dari hasil observasi.
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeKebutuhan(Request $request, Kegiatan $kegiatan)
    {
        $validated = $this->validateKebutuhanData($request);

        // Cek apakah dokumentasi observasi sudah ada
        $dokumentasiObservasi = $kegiatan->dokumentasi()
            ->where('tipe', 'observasi')
            ->first();

        if (!$dokumentasiObservasi) {
            return redirect()->back()
                ->withErrors(['kebutuhan_error' => 'Harap isi dokumentasi observasi terlebih dahulu.']);
        }

        // Hitung total dan simpan kebutuhan
        $validated['total'] = $validated['jumlah'] * $validated['harga_satuan'];
        $validated['kegiatan_id'] = $kegiatan->id;

        $dokumentasiObservasi->kebutuhans()->create($validated);

        return redirect()->back()
            ->with('success', 'Data kebutuhan berhasil disimpan.');
    }

    /**
     * Melanjutkan ke tahap berikutnya setelah dokumentasi observasi selesai.
     * TAHAP: DOKUMENTASI_OBSERVASI → MENUNGGU_PROSES_KABID
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function lanjutTahapBerikutnya(Request $request, Kegiatan $kegiatan)
    {
        // Validasi dokumentasi observasi sudah ada
        $dokumentasiObservasi = $kegiatan->dokumentasi()
            ->where('tipe', 'observasi')
            ->first();
        
        if (!$dokumentasiObservasi) {
            return redirect()->back()
                ->withErrors(['error' => 'Harap lengkapi dokumentasi observasi terlebih dahulu.']);
        }

        // Update ke tahap menunggu proses Kabid
        $kegiatan->update([
            'tahapan' => TahapanKegiatan::MENUNGGU_PROSES_KABID
        ]);

        return redirect()->back()
            ->with('success', 'Dokumentasi observasi selesai. Menunggu proses dari Kabid.');
    }

    // ==================== TAHAP 3: MENUNGGU PROSES KABID ====================
    // (Tahap ini dikelola oleh Kabid - pegawai menunggu)

    // ==================== TAHAP 4: DOKUMENTASI PENYERAHAN ====================

    /**
     * Menyimpan dokumentasi penyerahan bantuan.
     * TAHAP: DOKUMENTASI_PENYERAHAN → PENYELESAIAN
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storePenyerahan(Request $request, Kegiatan $kegiatan)
    {
        $validated = $this->validatePenyerahanData($request);

        // Buat dokumentasi penyerahan
        $dokumentasi = $kegiatan->dokumentasi()->create([
            'nama_dokumentasi' => $validated['judul'],
            'tipe' => 'penyerahan',
        ]);

        // Simpan foto-foto dokumentasi penyerahan
        $this->savePenyerahanFotos($request, $dokumentasi);

        // Lanjut ke tahap penyelesaian
        $kegiatan->update([
            'tahapan' => TahapanKegiatan::PENYELESAIAN
        ]);

        return redirect()->back()
            ->with('success', 'Dokumentasi penyerahan berhasil disimpan.');
    }

    /**
     * Upload dokumen kontrak pihak ketiga.
     *
     * @param StoreKontrakRequest $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeKontrak(StoreKontrakRequest $request, Kegiatan $kegiatan)
    {
        $validated = $request->validated();

        // Upload file kontrak
        $path = $request->file('dokumen_kontrak')
            ->store('kontrak_pihak_ketiga', 'public');

        // Simpan data kontrak
        $kegiatan->kontrak()->create([
            'nama_kontrak' => $validated['nama_pihak_ketiga'],
            'nomor_kontrak' => $validated['nomor_kontrak'],
            'tanggal_kontrak' => $validated['tanggal_kontrak'],
            'nilai_kontrak' => $validated['nilai_kontrak'] ?? 0,
            'file_path' => $path,
        ]);

        return redirect()->back()
            ->with('success', 'Dokumen kontrak berhasil disimpan.');
    }

    /**
     * Upload dokumen tambahan dari pihak ketiga.
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function uploadPihakKetiga(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'file_pihak_ketiga' => 'required|file',
        ]);

        // Hapus file lama jika ada
        $this->deleteOldFile($kegiatan->file_pihak_ketiga_path);

        // Upload file baru
        $filePath = $request->file('file_pihak_ketiga')
            ->store('dokumen_pihak_ketiga', 'public');

        $kegiatan->update([
            'file_pihak_ketiga_path' => $filePath
        ]);

        return redirect()->back()
            ->with('success', 'File pihak ketiga berhasil diunggah.');
    }

    // ==================== TAHAP 5: PENYELESAIAN ====================

    /**
     * Menyimpan berita acara kegiatan.
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeBeritaAcara(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'file_berita_acara' => 'required|file',
        ]);

        // Hapus berita acara lama jika ada
        if ($kegiatan->beritaAcara) {
            Storage::disk('public')->delete($kegiatan->beritaAcara->file_path);
            $kegiatan->beritaAcara->delete();
        }

        // Upload dan simpan berita acara baru
        $filePath = $request->file('file_berita_acara')
            ->store('berita_acara', 'public');

        $kegiatan->beritaAcara()->create([
            'nama_berita_acara' => 'Berita Acara - ' . $kegiatan->nama_kegiatan,
            'file_path' => $filePath,
        ]);

        return redirect()->back()
            ->with('success', 'Berita Acara berhasil diunggah.');
    }

    /**
     * Menyelesaikan kegiatan dengan status akhir.
     * TAHAP: PENYELESAIAN → SELESAI
     *
     * @param Request $request
     * @param Kegiatan $kegiatan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatusAkhir(Request $request, Kegiatan $kegiatan)
    {
        // Validasi berita acara sudah diunggah
        if (!$kegiatan->beritaAcara) {
            return redirect()->back()
                ->withErrors(['status_akhir' => 'Harap unggah Berita Acara terlebih dahulu.']);
        }

        $validated = $request->validate([
            'status_akhir' => ['required', Rule::in(['selesai', 'ditunda', 'dibatalkan'])],
        ]);

        // Update status akhir dan tahapan
        $kegiatan->update([
            'status_akhir' => $validated['status_akhir'],
            'tahapan' => TahapanKegiatan::SELESAI,
        ]);

        return redirect()->route('pegawai.kegiatan.myIndex', ['tahapan' => 'selesai'])
            ->with('success', 'Kegiatan berhasil diselesaikan.');
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Simpan foto-foto dokumentasi observasi.
     *
     * @param Request $request
     * @param \App\Models\Dokumentasi $dokumentasi
     * @return void
     */
    private function saveDokumentasiFotos(Request $request, $dokumentasi)
    {
        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('dokumentasi/fotos', 'public');
                $dokumentasi->fotos()->create(['file_path' => $path]);
            }
        }
    }

    /**
     * Simpan foto-foto dokumentasi penyerahan.
     *
     * @param Request $request
     * @param \App\Models\Dokumentasi $dokumentasi
     * @return void
     */
    private function savePenyerahanFotos(Request $request, $dokumentasi)
    {
        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('dokumentasi_foto', 'public');
                $dokumentasi->fotos()->create(['file_path' => $path]);
            }
        }
    }

    /**
     * Validasi data kebutuhan dari observasi.
     *
     * @param Request $request
     * @return array
     */
    private function validateKebutuhanData(Request $request)
    {
        return $request->validate([
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:1',
            'satuan' => 'required|string|max:50',
            'harga_satuan' => 'required|numeric|min:0',
        ]);
    }

    /**
     * Validasi data dokumentasi penyerahan.
     *
     * @param Request $request
     * @return array
     */
    private function validatePenyerahanData(Request $request)
    {
        return $request->validate([
            'judul' => 'required|string|max:255',
            'fotos' => 'required|array',
            'fotos.*' => 'required|file'
        ]);
    }

    /**
     * Hapus file lama jika ada.
     *
     * @param string|null $filePath
     * @return void
     */
    private function deleteOldFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}