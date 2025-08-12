import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Dialog from '@/Components/Dialog';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';
import TextInput from '@/Components/TextInput';

export default function DokumentasiPenyerahanView({ kegiatans }) {
    // State untuk mengelola dialog box
    const [modalState, setModalState] = useState({
        isPenyerahanOpen: false,
        isPihakKetigaOpen: false,
        isKontrakOpen: false,
    });
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

    // Form untuk DOKUMENTASI PENYERAHAN
    const penyerahanForm = useForm({
        judul: '',
        fotos: [], // Izinkan multiple files
    });

    // Form untuk FILE PIHAK KETIGA
    const pihakKetigaForm = useForm({
        file_pihak_ketiga: null,
    });

    // Form untuk KONTRAK
    const kontrakForm = useForm({
        nomor_kontrak: '',
        tanggal_kontrak: '',
        nilai_kontrak: '',
        // --- PERBAIKAN 1: Mengatur nilai default ---
        nama_pihak_ketiga: 'Pihak Ketiga', 
        dokumen_kontrak: null,
    });

    // --- Fungsi untuk membuka dan menutup dialog ---
    const openModal = (type, kegiatan) => {
        setSelectedKegiatan(kegiatan);
        if (type === 'penyerahan') {
            setModalState({ ...modalState, isPenyerahanOpen: true });
        } else if (type === 'pihakKetiga') {
            setModalState({ ...modalState, isPihakKetigaOpen: true });
        } else if (type === 'kontrak') {
            setModalState({ ...modalState, isKontrakOpen: true });
        }
    };

    const closeModal = () => {
        setModalState({ 
            isPenyerahanOpen: false, 
            isPihakKetigaOpen: false, 
            isKontrakOpen: false 
        });
        setSelectedKegiatan(null);
        penyerahanForm.reset();
        pihakKetigaForm.reset();
        kontrakForm.reset();
    };

    // --- Handler untuk Submit Form ---

    // Handler untuk form DOKUMENTASI PENYERAHAN
    const handlePenyerahanSubmit = (e) => {
        e.preventDefault();
        if (!selectedKegiatan) return;

        penyerahanForm.post(route('pegawai.kegiatan.storePenyerahan', selectedKegiatan.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire('Berhasil!', 'Dokumentasi penyerahan berhasil disimpan.', 'success');
            },
            onError: (err) => {
                const errorMessages = Object.values(err).join('<br/>');
                Swal.fire('Gagal!', `Terjadi kesalahan:<br/><br/>${errorMessages}`, 'error');
            },
            preserveScroll: true,
        });
    };
    
    // Handler untuk form FILE PIHAK KETIGA
    const handlePihakKetigaSubmit = (e) => {
        e.preventDefault();
        if (!selectedKegiatan) return;

        pihakKetigaForm.post(route('pegawai.kegiatan.uploadPihakKetiga', selectedKegiatan.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire('Berhasil!', 'File dari pihak ketiga berhasil diunggah.', 'success');
            },
            onError: (err) => {
                const errorMessages = Object.values(err).join('<br/>');
                Swal.fire('Gagal!', `Terjadi kesalahan:<br/><br/>${errorMessages}`, 'error');
            },
            preserveScroll: true,
        });
    };

    // Handler untuk form KONTRAK
    const handleKontrakSubmit = (e) => {
        e.preventDefault();
        if (!selectedKegiatan) return;

        kontrakForm.post(route('pegawai.kegiatan.storeKontrak', selectedKegiatan.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire('Berhasil!', 'Data kontrak berhasil disimpan.', 'success');
            },
            onError: (err) => {
                const errorMessages = Object.values(err).join('<br/>');
                Swal.fire('Gagal!', `Terjadi kesalahan:<br/><br/>${errorMessages}`, 'error');
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#394B7A] text-white">
                                <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                    Nama Kegiatan
                                </th>
                                <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                    Status Penyerahan
                                </th>
                                <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                    Dokumen Kontrak
                                </th>
                                <th className="px-6 py-4 text-center font-semibold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {kegiatans.data.length > 0 ? (
                                kegiatans.data.map((kegiatan) => {
                                    const dokPenyerahan = (kegiatan.dokumentasi ?? []).find(d => d.tipe === 'penyerahan');
                                    return (
                                        <tr key={kegiatan.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 border-r border-gray-200 font-medium">
                                                {kegiatan.nama_kegiatan}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {kegiatan.tanggal_kegiatan}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {dokPenyerahan ? (
                                                    <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                                        Sudah Diisi
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                                                        Belum Diisi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {kegiatan.kontrak ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                                            Sudah Ada
                                                        </span>
                                                        <a 
                                                            href={`/storage/${kegiatan.kontrak.dokumen_kontrak}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            (Lihat Kontrak)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => openModal('kontrak', kegiatan)} 
                                                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Input Kontrak
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    {dokPenyerahan ? (
                                                        <Link 
                                                            href={route('pegawai.kegiatan.myIndex', { tahapan: 'penyelesaian' })} 
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                        >
                                                            Lanjutkan Penyelesaian
                                                        </Link>
                                                    ) : (
                                                        <button 
                                                            onClick={() => openModal('penyerahan', kegiatan)} 
                                                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                        >
                                                            Lakukan Penyerahan
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">
                                        Tidak ada kegiatan pada tahap ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialog Box untuk DOKUMENTASI PENYERAHAN */}
            <Dialog show={modalState.isPenyerahanOpen} onClose={closeModal}>
                <form onSubmit={handlePenyerahanSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Dokumentasi Penyerahan
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Lengkapi dokumentasi untuk kegiatan: <span className="font-semibold">{selectedKegiatan?.nama_kegiatan}</span>
                    </p>

                    <div className="mt-6">
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                            Judul Dokumentasi
                        </label>
                        <TextInput
                            id="judul"
                            name="judul"
                            value={penyerahanForm.data.judul}
                            className="mt-1 block w-full"
                            onChange={(e) => penyerahanForm.setData('judul', e.target.value)}
                            required
                        />
                        <InputError message={penyerahanForm.errors.judul} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="fotos" className="block text-sm font-medium text-gray-700">
                            Unggah Foto Bukti (Bisa lebih dari satu)
                        </label>
                        <input
                            id="fotos"
                            type="file"
                            name="fotos"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            onChange={(e) => penyerahanForm.setData('fotos', e.target.files)}
                            multiple
                            accept="image/*"
                            required
                        />
                        <InputError message={penyerahanForm.errors.fotos} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={penyerahanForm.processing}>
                            {penyerahanForm.processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>

            {/* Dialog Box untuk UPLOAD FILE PIHAK KETIGA */}
            <Dialog show={modalState.isPihakKetigaOpen} onClose={closeModal}>
                 <form onSubmit={handlePihakKetigaSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Unggah Dokumen Pihak Ketiga
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Untuk kegiatan: <span className="font-semibold">{selectedKegiatan?.nama_kegiatan}</span>
                    </p>

                    <div className="mt-6">
                        <label htmlFor="file_pihak_ketiga" className="block text-sm font-medium text-gray-700">
                            Pilih File (PDF)
                        </label>
                        <input
                            id="file_pihak_ketiga"
                            type="file"
                            name="file_pihak_ketiga"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(e) => pihakKetigaForm.setData('file_pihak_ketiga', e.target.files[0])}
                            accept=".pdf"
                            required
                        />
                        <InputError message={pihakKetigaForm.errors.file_pihak_ketiga} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={pihakKetigaForm.processing}>
                            {pihakKetigaForm.processing ? 'Mengunggah...' : 'Unggah'}
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>

            {/* Dialog Box untuk INPUT KONTRAK */}
            <Dialog show={modalState.isKontrakOpen} onClose={closeModal}>
                <form onSubmit={handleKontrakSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Input Data Kontrak
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Untuk kegiatan: <span className="font-semibold">{selectedKegiatan?.nama_kegiatan}</span>
                    </p>

                    <div className="mt-6">
                        <label htmlFor="nomor_kontrak" className="block text-sm font-medium text-gray-700">
                            Nama Pt Kontrak pihak ke 3
                        </label>
                        <TextInput
                            id="nomor_kontrak"
                            name="nomor_kontrak"
                            value={kontrakForm.data.nomor_kontrak}
                            className="mt-1 block w-full"
                            onChange={(e) => kontrakForm.setData('nomor_kontrak', e.target.value)}
                            required
                        />
                        <InputError message={kontrakForm.errors.nomor_kontrak} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="tanggal_kontrak" className="block text-sm font-medium text-gray-700">
                            Tanggal Kontrak
                        </label>
                        <input
                            id="tanggal_kontrak"
                            type="date"
                            name="tanggal_kontrak"
                            value={kontrakForm.data.tanggal_kontrak}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => kontrakForm.setData('tanggal_kontrak', e.target.value)}
                            required
                        />
                        <InputError message={kontrakForm.errors.tanggal_kontrak} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="nilai_kontrak" className="block text-sm font-medium text-gray-700">
                            Nilai Kontrak (Rp)
                        </label>
                        <TextInput
                            id="nilai_kontrak"
                            name="nilai_kontrak"
                            type="number"
                            value={kontrakForm.data.nilai_kontrak}
                            className="mt-1 block w-full"
                            onChange={(e) => kontrakForm.setData('nilai_kontrak', e.target.value)}
                            required
                        />
                        <InputError message={kontrakForm.errors.nilai_kontrak} className="mt-2" />
                    </div>

                    {/* --- PERBAIKAN 2: Menghapus input field --- */}
                    {/* Input field untuk nama pihak ketiga dihapus dari tampilan */}

                    <div className="mt-4">
                        <label htmlFor="dokumen_kontrak" className="block text-sm font-medium text-gray-700">
                            Upload Dokumen Kontrak (PDF)
                        </label>
                        <input
                            id="dokumen_kontrak"
                            type="file"
                            name="dokumen_kontrak"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            onChange={(e) => kontrakForm.setData('dokumen_kontrak', e.target.files[0])}
                            accept=".pdf"
                            required
                        />
                        <InputError message={kontrakForm.errors.dokumen_kontrak} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={kontrakForm.processing}>
                            {kontrakForm.processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
