import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, kegiatans, queryParams = {} }) {
    queryParams = queryParams || {};
    
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('arsip.index'), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-white leading-tight">
                        Arsip Kegiatan
                    </h2>
                </div>
            }
        >
            <Head title="Arsip Kegiatan" />

            <div className="py-6">
                <div className="max-w-full mx-auto">
                    
                    {/* Header dengan Search dan Judul ARSIP KEGIATAN sejajar */}
                    <div className="flex justify-between items-center mb-6">
                        <TextInput
                            defaultValue={queryParams.nama_kegiatan}
                            className="w-80"
                            placeholder="Cari berdasarkan nama kegiatan..."
                            onBlur={(e) => searchFieldChanged('nama_kegiatan', e.target.value)}
                            onKeyPress={(e) => onKeyPress('nama_kegiatan', e)}
                        />
                        <h3 className="text-xl font-bold text-gray-800 flex-1 text-center">ARSIP KEGIATAN</h3>
                        <div className="w-80"></div> {/* Spacer untuk balance */}
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
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Proposal</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Status Akhir</th>
                                        <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kegiatans.data && kegiatans.data.length > 0 ? (
                                        kegiatans.data.map((kegiatan, index) => (
                                            <tr
                                                key={kegiatan.id}
                                                className="border-b border-gray-200 hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {((kegiatans.meta.current_page - 1) * kegiatans.meta.per_page) + index + 1}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200 font-medium">
                                                    {kegiatan.nama_kegiatan}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {kegiatan.proposal?.nama_proposal || '-'}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {kegiatan.tanggal_kegiatan}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    <span className={`px-2 py-1 rounded text-white text-sm font-medium ${
                                                        kegiatan.status_akhir === 'selesai' ? 'bg-green-500' :
                                                        kegiatan.status_akhir === 'ditunda' ? 'bg-yellow-500' : 
                                                        kegiatan.status_akhir === 'dibatalkan' ? 'bg-red-500' : 'bg-gray-500'
                                                    }`}>
                                                        {kegiatan.status_akhir}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route('arsip.show', kegiatan.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        // Empty rows untuk menunjukkan struktur tabel
                                        Array.from({ length: 8 }, (_, index) => (
                                            <tr key={index} className="border-b border-gray-200">
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8">
                                                    <div className="flex justify-center">
                                                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                                                            Detail
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
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