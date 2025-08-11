// resources/js/Pages/Pegawai/Partials/PenyelesaianView.jsx

import { useForm, Link, router } from '@inertiajs/react'; // <-- Tambahkan 'router'
import Swal from 'sweetalert2';

const PenyelesaianRow = ({ kegiatan }) => {
    const { data: baData, setData: setBaData, post: postBa, processing: processingBa, errors: baErrors, reset: resetBa } = useForm({
        file_berita_acara: null,
    });

    const { data: statusData, setData: setStatusData, patch: patchStatus, processing: processingStatus, errors: statusErrors } = useForm({
        status_akhir: kegiatan.status_akhir || 'selesai',
    });

    function handleBeritaAcaraSubmit(e) {
        e.preventDefault();
        postBa(route('pegawai.kegiatan.storeBeritaAcara', kegiatan.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetBa();
                Swal.fire('Berhasil!', 'File Berita Acara berhasil diunggah.', 'success');
            },
            onError: (err) => {
                 Swal.fire('Gagal!', err.file_berita_acara || 'Terjadi kesalahan saat mengunggah file.', 'error');
            }
        });
    }

    function handleStatusSubmit(e) {
        e.preventDefault();
        patchStatus(route('pegawai.kegiatan.updateStatusAkhir', kegiatan.id), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire('Berhasil!', 'Status kegiatan berhasil diperbarui.', 'success').then(() => {
                    // --- PERMINTAAN BARU: Pindah ke tab 'selesai' ---
                    router.get(route('pegawai.kegiatan.myIndex', { tahapan: 'selesai' }));
                });
            }
        });
    }

    const hasBeritaAcara = !!kegiatan.berita_acara;

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 border-r border-gray-200 font-medium align-middle">
                {kegiatan.nama_kegiatan}
            </td>
            
            {/* Kolom Berita Acara (Baru) */}
            <td className="px-6 py-4 border-r border-gray-200 align-middle">
                {/* --- PERMINTAAN BARU: Logika untuk menyembunyikan form --- */}
                {hasBeritaAcara ? (
                    <a 
                        href={kegiatan.berita_acara.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Lihat Berita Acara
                    </a>
                ) : (
                    <form onSubmit={handleBeritaAcaraSubmit} className="flex items-center gap-2">
                        <input
                            type="file"
                            onChange={(e) => setBaData('file_berita_acara', e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                        <button type="submit" disabled={processingBa} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                            Unggah
                        </button>
                    </form>
                )}
                {baErrors.file_berita_acara && <p className="text-red-500 text-sm mt-1">{baErrors.file_berita_acara}</p>}
            </td>

            <td className="px-6 py-4 border-r border-gray-200 align-middle">
                {kegiatan.tanggal_kegiatan}
            </td>

            {/* Kolom Aksi (Diubah) */}
            <td className="px-6 py-4 text-center align-middle">
                <form onSubmit={handleStatusSubmit} className="flex items-center justify-center gap-2">
                    <select
                        value={statusData.status_akhir}
                        onChange={(e) => setStatusData('status_akhir', e.target.value)}
                        className="border border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100 px-3 py-1"
                        disabled={!hasBeritaAcara}
                    >
                        <option value="selesai">Selesai</option>
                        <option value="ditunda">Ditunda</option>
                        <option value="dibatalkan">Dibatalkan</option>
                    </select>
                    <button 
                        type="submit" 
                        disabled={!hasBeritaAcara || processingStatus} 
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                    >
                        Simpan
                    </button>
                </form>
                {statusErrors.status_akhir && <p className="text-red-500 text-sm mt-1">{statusErrors.status_akhir}</p>}
            </td>
        </tr>
    );
};


export default function PenyelesaianView({ kegiatans }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#394B7A] text-white">
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Nama Kegiatan
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Berita Acara
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Tanggal Kegiatan
                            </th>
                            <th className="px-6 py-4 text-center font-semibold">
                                Status Akhir
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kegiatans.data.length > 0 ? (
                            kegiatans.data.map((kegiatan) => (
                                <PenyelesaianRow key={kegiatan.id} kegiatan={kegiatan} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                                    Tidak ada kegiatan pada tahap ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}