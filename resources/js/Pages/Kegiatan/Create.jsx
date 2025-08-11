import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Create({ auth, proposals, tims }) {
    const { data, setData, post, errors, processing } = useForm({
        nama_kegiatan: '',
        deskripsi_kegiatan: '',
        tanggal_kegiatan: '',
        proposal_id: '',
        tim_id: '',
        sktl_path: null,
    });

    const [fileName, setFileName] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('kegiatan.store'));
    };

    const handleFileChange = (file) => {
        if (file) {
            setData('sktl_path', file);
            setFileName(file.name);
        }
    };

    // PERBAIKAN: Buat variabel untuk array yang akan di-map
    const proposalList = proposals.data || proposals;
    const timList = tims.data || tims;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Kegiatan Baru</h2>}
        >
            <Head title="Buat Kegiatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={onSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="nama_kegiatan" value="Nama Kegiatan" />
                                    <TextInput
                                        id="nama_kegiatan"
                                        name="nama_kegiatan"
                                        value={data.nama_kegiatan}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('nama_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.nama_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="deskripsi_kegiatan" value="Deskripsi Kegiatan" />
                                    <TextAreaInput
                                        id="deskripsi_kegiatan"
                                        name="deskripsi_kegiatan"
                                        value={data.deskripsi_kegiatan}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('deskripsi_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.deskripsi_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="tanggal_kegiatan" value="Tanggal Kegiatan" />
                                    <TextInput
                                        id="tanggal_kegiatan"
                                        type="date"
                                        name="tanggal_kegiatan"
                                        value={data.tanggal_kegiatan}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('tanggal_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.tanggal_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="proposal_id" value="Proposal Terkait" />
                                    <SelectInput
                                        id="proposal_id"
                                        name="proposal_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('proposal_id', e.target.value)}
                                    >
                                        <option value="">Pilih Proposal</option>
                                        {/* PERBAIKAN: Gunakan variabel proposalList */}
                                        {proposalList.map((proposal) => (
                                            <option key={proposal.id} value={proposal.id}>
                                                {proposal.nama_proposal}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.proposal_id} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="tim_id" value="Tim yang Ditugaskan" />
                                    <SelectInput
                                        id="tim_id"
                                        name="tim_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('tim_id', e.target.value)}
                                    >
                                        <option value="">Pilih Tim</option>
                                        {/* PERBAIKAN: Gunakan variabel timList */}
                                        {timList.map((tim) => (
                                            <option key={tim.id} value={tim.id}>
                                                {tim.nama_tim}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.tim_id} className="mt-2" />
                                </div>

                                {/* Area Upload File SKTL yang Diperbaiki */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="sktl_path" value="Unggah SKTL (Surat Keputusan Tugas Lapangan)" />
                                    <div className="mt-1 relative">
                                        <label className="cursor-pointer block">
                                            <div className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                                <span className={`${fileName ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {fileName || 'Unggah file SKTL'}
                                                </span>
                                                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <InputError message={errors.sktl_path} className="mt-2" />
                                </div>

                                {/* Tombol yang Diperbaiki - Panjang */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: '#25335C' }}
                                    >
                                        {processing ? 'Membuat Kegiatan...' : 'Buat Kegiatan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}