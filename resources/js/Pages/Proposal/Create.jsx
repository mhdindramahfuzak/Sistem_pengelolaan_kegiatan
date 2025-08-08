import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        nama_proposal: '',
        deskripsi: '', // Tambahkan field deskripsi
        tujuan: '',    // Tambahkan field tujuan
        dokumen_path: null,
        tanggal_pengajuan: new Date().toISOString().slice(0, 10), // Otomatis isi tanggal hari ini
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('proposal.store'));
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

                            {/* Input Field Baru untuk Deskripsi */}
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

                            {/* Input Field Baru untuk Tujuan */}
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

                            <div className="mt-4">
                                <InputLabel htmlFor="dokumen_path" value="Dokumen Pendukung (PDF/DOC)" />
                                <TextInput
                                    id="dokumen_path"
                                    type="file"
                                    name="dokumen_path"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('dokumen_path', e.target.files[0])}
                                />
                                <InputError message={errors.dokumen_path} className="mt-2" />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <PrimaryButton disabled={processing}>
                                    Ajukan Proposal
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
