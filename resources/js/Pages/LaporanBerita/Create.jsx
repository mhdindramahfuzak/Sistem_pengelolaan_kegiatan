import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kegiatan: '',
        nomor_dpa: '',
        tanggal: '',
        nama_alat: '',
        dalam_rangka: '',
        nama_kabupaten: '',
        jenis_bantuan: '',
        jumlah_bantuan: '',
        nama_penerima: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        // Route ini akan memproses data dan mengembalikan file untuk di-download
        post(route('laporan-berita.download'), {
            // Penting: Browser akan menangani response file secara otomatis
            // Inertia tidak akan mencoba me-render halaman baru
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Download Laporan Berita</h2>}
        >
            <Head title="Buat Laporan Berita" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-6 space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800">Formulir Laporan Berita</h2>
                            
                            {/* Menampilkan error umum jika ada */}
                            {errors.template && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{errors.template}</div>}
                            {errors.process && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{errors.process}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input 1 */}
                                <div>
                                    <InputLabel htmlFor="nama_kegiatan" value="Nama Kegiatan (input1)" />
                                    <TextInput id="nama_kegiatan" value={data.nama_kegiatan} onChange={(e) => setData('nama_kegiatan', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_kegiatan} className="mt-2" />
                                </div>
                                {/* Input 2 */}
                                <div>
                                    <InputLabel htmlFor="nomor_dpa" value="Nomor DPA (input2)" />
                                    <TextInput id="nomor_dpa" value={data.nomor_dpa} onChange={(e) => setData('nomor_dpa', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nomor_dpa} className="mt-2" />
                                </div>
                                {/* Input 3 */}
                                <div>
                                    <InputLabel htmlFor="tanggal" value="Tanggal (input3)" />
                                    <TextInput id="tanggal" type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.tanggal} className="mt-2" />
                                </div>
                                {/* Input 4 */}
                                <div>
                                    <InputLabel htmlFor="nama_alat" value="Nama Alat yang Diberikan (input4)" />
                                    <TextInput id="nama_alat" value={data.nama_alat} onChange={(e) => setData('nama_alat', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_alat} className="mt-2" />
                                </div>
                                {/* Input 5 */}
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="dalam_rangka" value="Dalam Rangka (input5)" />
                                    <TextInput id="dalam_rangka" value={data.dalam_rangka} onChange={(e) => setData('dalam_rangka', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.dalam_rangka} className="mt-2" />
                                </div>
                                {/* Input 6 */}
                                <div>
                                    <InputLabel htmlFor="nama_kabupaten" value="Nama Kabupaten Penerima (input6)" />
                                    <TextInput id="nama_kabupaten" value={data.nama_kabupaten} onChange={(e) => setData('nama_kabupaten', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_kabupaten} className="mt-2" />
                                </div>
                                {/* Input 7 */}
                                <div>
                                    <InputLabel htmlFor="jenis_bantuan" value="Jenis Bantuan (input7)" />
                                    <TextInput id="jenis_bantuan" value={data.jenis_bantuan} onChange={(e) => setData('jenis_bantuan', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.jenis_bantuan} className="mt-2" />
                                </div>
                                {/* Input 8 */}
                                <div>
                                    <InputLabel htmlFor="jumlah_bantuan" value="Jumlah Bantuan (input8)" />
                                    <TextInput id="jumlah_bantuan" type="number" value={data.jumlah_bantuan} onChange={(e) => setData('jumlah_bantuan', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.jumlah_bantuan} className="mt-2" />
                                </div>
                                {/* Input 9 */}
                                <div>
                                    <InputLabel htmlFor="nama_penerima" value="Nama Penerima Bantuan (input9)" />
                                    <TextInput id="nama_penerima" value={data.nama_penerima} onChange={(e) => setData('nama_penerima', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_penerima} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-6 border-t pt-6">
                                <Link href={route('dashboard')}>
                                    <SecondaryButton type="button">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Memproses...' : 'Download Laporan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}