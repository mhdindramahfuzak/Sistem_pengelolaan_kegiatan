import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Dialog from '@/Components/Dialog';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

// Komponen terpisah untuk setiap baris agar state tidak tercampur
const KegiatanRow = ({ kegiatan, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal_penyerahan: '',
        file_sktl: null,
        _method: 'patch',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('manajemen.penyerahan.update', kegiatan.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Kegiatan telah dilanjutkan ke tahap penyerahan.',
                    timer: 3000,
                    showConfirmButton: false,
                });
            },
            onError: (err) => {
                const errorMessages = Object.values(err).join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Terjadi kesalahan. \n\n${errorMessages}`,
                });
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                <td className="px-6 py-4 border-r border-gray-200 font-medium">{kegiatan.nama_kegiatan}</td>
                <td className="px-6 py-4 border-r border-gray-200">{kegiatan.tim?.nama_tim || 'Belum ada tim'}</td>
                <td className="px-6 py-4 border-r border-gray-200">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-6 py-4 text-center">
                    <button
                        onClick={openModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                        Proses Penyerahan
                    </button>
                </td>
            </tr>

            <Dialog show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Proses Penyerahan untuk "{kegiatan.nama_kegiatan}"
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Unggah SKTL Penyerahan untuk melanjutkan kegiatan.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="tanggal_penyerahan" className="block text-sm font-medium text-gray-700">
                            Tanggal Penyerahan
                        </label>
                        <TextInput
                            id="tanggal_penyerahan"
                            type="date"
                            name="tanggal_penyerahan"
                            value={data.tanggal_penyerahan}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('tanggal_penyerahan', e.target.value)}
                            required
                        />
                        <InputError message={errors.tanggal_penyerahan} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="file_sktl" className="block text-sm font-medium text-gray-700">
                            File SKTL Penyerahan (PDF, JPG, PNG)
                        </label>
                        <input
                            id="file_sktl"
                            type="file"
                            name="file_sktl"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(e) => setData('file_sktl', e.target.files[0])}
                            required
                        />
                        <InputError message={errors.file_sktl} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            {processing ? 'Memproses...' : 'Lanjutkan Tahap'}
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default function IndexPenyerahan({ auth, kegiatans, success }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-white leading-tight">
                        Manajemen Penyerahan Kegiatan
                    </h2>
                </div>
            }
        >
            <Head title="Manajemen Penyerahan" />

            <div className="py-6">
                <div className="max-w-full mx-auto">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
                            {success}
                        </div>
                    )}
                    
                    {/* Header dengan Judul */}
                    <div className="flex justify-center items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">MANAJEMEN PENYERAHAN KEGIATAN</h3>
                    </div>

                    {/* Deskripsi */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                        <p className="text-blue-800 text-sm">
                            <strong>Info:</strong> Daftar kegiatan yang telah menyelesaikan tahap observasi dan siap untuk dilanjutkan ke tahap penyerahan.
                        </p>
                    </div>
                    
                    {/* Container dengan background putih dan shadow */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        
                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#394B7A] text-white">
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Kegiatan</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tim Pelaksana</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tanggal Kegiatan</th>
                                        <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kegiatans.data && kegiatans.data.length > 0 ? (
                                        kegiatans.data.map((kegiatan, index) => (
                                            <KegiatanRow 
                                                key={kegiatan.id} 
                                                kegiatan={kegiatan} 
                                                index={((kegiatans.meta.current_page - 1) * kegiatans.meta.per_page) + index}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                    </svg>
                                                    <p className="text-lg font-medium">Tidak ada kegiatan yang perlu diproses</p>
                                                    <p className="text-sm mt-1">Belum ada kegiatan yang siap untuk tahap penyerahan saat ini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {kegiatans.meta && kegiatans.meta.links && (
                        <div className="mt-6">
                            <Pagination links={kegiatans.meta.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}