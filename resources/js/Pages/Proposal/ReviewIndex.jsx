import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextAreaInput from '@/Components/TextAreaInput';
import InputError from '@/Components/InputError';

export default function ReviewIndex({ auth, proposals }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);
    const [actionType, setActionType] = useState(''); // 'disetujui' atau 'ditolak'
    const { data, setData, patch, processing, errors, reset } = useForm({
        status: '',
        alasan_penolakan: '',
    });

    const openConfirmModal = (proposal, type) => {
        setCurrentProposal(proposal);
        setActionType(type);
        setData({ status: type, alasan_penolakan: '' });
        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setCurrentProposal(null);
        reset();
    };

    const onConfirm = (e) => {
        e.preventDefault();
        patch(route('verifikasi.proposal.update', currentProposal.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-white leading-tight">
                        Verifikasi Proposal Masuk
                    </h2>
                </div>
            }
        >
            <Head title="Verifikasi Proposal" />

            <div className="py-6">
                <div className="max-w-full mx-auto">
                    {/* Header dengan Judul */}
                    <div className="flex justify-center items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">DAFTAR PROPOSAL UNTUK VERIFIKASI</h3>
                    </div>
                    
                    {/* Table Container */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#394B7A] text-white">
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Proposal</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Pengusul</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tanggal Diajukan</th>
                                        {/* PERBAIKAN: Tambahkan kolom dokumen proposal */}
                                        <th className="px-6 py-4 text-center font-semibold border-r border-[#4A5B8F]">Dokumen Proposal</th>
                                        <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.data.map((proposal, index) => (
                                        <tr
                                            key={proposal.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {((proposals.meta.current_page - 1) * proposals.meta.per_page) + index + 1}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-200 font-medium">{proposal.nama_proposal}</td>
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {proposal.pengusul?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-200">
                                                {new Date(proposal.tanggal_pengajuan).toLocaleDateString("id-ID", {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            {/* PERBAIKAN: Tambahkan kolom untuk melihat dokumen proposal */}
                                            <td className="px-6 py-4 border-r border-gray-200 text-center">
                                                {proposal.dokumen_url ? (
                                                    <a
                                                        href={proposal.dokumen_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors inline-block"
                                                    >
                                                        Lihat Dokumen
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Tidak Ada</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => openConfirmModal(proposal, 'disetujui')}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => openConfirmModal(proposal, 'ditolak')}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* Jika tidak ada data */}
                                    {proposals.data.length === 0 && (
                                        <tr className="border-b border-gray-200">
                                            <td colSpan="6" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500 text-lg font-medium">
                                                        Tidak ada proposal yang perlu diverifikasi.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi */}
            <Modal show={showConfirmModal} onClose={closeModal}>
                <form onSubmit={onConfirm} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Konfirmasi Aksi
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Anda akan {actionType === 'disetujui' ? 'menyetujui' : 'menolak'} proposal "{currentProposal?.nama_proposal}".
                    </p>
                    {actionType === 'ditolak' && (
                        <div className="mt-4">
                            <InputLabel htmlFor="alasan_penolakan" value="Alasan Penolakan (Wajib diisi)" />
                            <TextAreaInput 
                                id="alasan_penolakan" 
                                className="mt-1 block w-full" 
                                value={data.alasan_penolakan} 
                                onChange={e => setData('alasan_penolakan', e.target.value)} 
                                required 
                            />
                            <InputError message={errors.alasan_penolakan} className="mt-2" />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Konfirmasi
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}