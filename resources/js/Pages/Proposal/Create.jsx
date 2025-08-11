import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Create({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        nama_proposal: '',
        deskripsi: '', 
        tujuan: '',    
        dokumen_path: null,
        tanggal_pengajuan: new Date().toISOString().slice(0, 10),
    });

    const [fileName, setFileName] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('proposal.store'));
    };

    const handleFileChange = (file) => {
        if (file) {
            setData('dokumen_path', file);
            setFileName(file.name);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajukan Proposal Baru</h2>}
        >
            <Head title="Buat Proposal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-6">
                            <div className="mt-4">
                                <InputLabel htmlFor="nama_proposal" value="Nama Proposal" />
                                <TextInput
                                    id="nama_proposal"
                                    name="nama_proposal"
                                    value={data.nama_proposal}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('nama_proposal', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nama_proposal} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="deskripsi" value="Deskripsi Proposal" />
                                <TextAreaInput
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={data.deskripsi}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    required
                                />
                                <InputError message={errors.deskripsi} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="tujuan" value="Tujuan Proposal" />
                                <TextAreaInput
                                    id="tujuan"
                                    name="tujuan"
                                    value={data.tujuan}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('tujuan', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tujuan} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="tanggal_pengajuan" value="Tanggal Pengajuan" />
                                <TextInput
                                    id="tanggal_pengajuan"
                                    type="date"
                                    name="tanggal_pengajuan"
                                    value={data.tanggal_pengajuan}
                                    className="mt-1 block w-full bg-gray-100"
                                    onChange={(e) => setData('tanggal_pengajuan', e.target.value)}
                                />
                                <InputError message={errors.tanggal_pengajuan} className="mt-2" />
                            </div>

                            {/* Area Upload File yang Baru */}
                            <div className="mt-4">
                                <InputLabel htmlFor="dokumen_path" value="Unggah Proposal" />
                                <div className="mt-1 relative">
                                    <label className="cursor-pointer block">
                                        <div className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                            <span className={`${fileName ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {fileName || 'Unggah file dalam bentuk Pdf'}
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
                                <InputError message={errors.dokumen_path} className="mt-2" />
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: '#25335C' }}
                                >
                                    {processing ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}