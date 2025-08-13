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
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Lihat Proposal</th>
                                        <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.data.map((proposal, index) => (
                                        <tr
                                            key={proposal.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                                            <td className="px-6 py-4 border-r border-gray-200 font-medium">{proposal.nama_proposal}</td>
                                            <td className="px-6 py-4 border-r border-gray-200">{proposal.pengusul.name}</td>
                                            <td className="px-6 py-4 border-r border-gray-200">{proposal.tanggal_pengajuan}</td>
                                            <td className="px-6 py-4 border-r border-gray-200 text-center">
                                                <Link
                                                    href={route('proposal.show', proposal.id)}
                                                    className="text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                                                >
                                                    Lihat
                                                </Link>
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
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                Tidak ada proposal yang perlu diverifikasi.
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