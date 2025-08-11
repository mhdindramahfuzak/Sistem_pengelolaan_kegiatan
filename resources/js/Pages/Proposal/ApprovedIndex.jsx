import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function ApprovedIndex({ auth, proposals, success }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-white leading-tight">
                        Proposal Disetujui
                    </h2>
                </div>
            }
        >
            <Head title="Proposal Disetujui" />

            <div className="py-6">
                <div className="max-w-full mx-auto">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
                            {success}
                        </div>
                    )}
                    
                    {/* Header dengan Judul */}
                    <div className="flex justify-center items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">PROPOSAL DISETUJUI</h3>
                    </div>
                    
                    {/* Container dengan background putih dan shadow */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        
                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#394B7A] text-white">
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Proposal</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Pengusul</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tanggal Disetujui</th>
                                        <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Status</th>
                                        <th className="px-6 py-4 text-center font-semibold border-r border-[#4A5B8F]">Dokumen Proposal</th>
                                        <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.data && proposals.data.length > 0 ? (
                                        proposals.data.map((proposal, index) => (
                                            <tr
                                                key={proposal.id}
                                                className="border-b border-gray-200 hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {((proposals.meta.current_page - 1) * proposals.meta.per_page) + index + 1}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200 font-medium">
                                                    {proposal.nama_proposal}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {proposal.pengusul?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    {new Date(proposal.created_at).toLocaleDateString("id-ID", {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-200">
                                                    <span className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium">
                                                        {proposal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
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
                                                    <Link
                                                        href={route('kegiatan.create', { proposal_id: proposal.id })}
                                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Buat Kegiatan
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        // Empty rows untuk menunjukkan struktur tabel
                                        Array.from({ length: 5 }, (_, index) => (
                                            <tr key={index} className="border-b border-gray-200">
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200"></td>
                                                <td className="px-6 py-8 border-r border-gray-200">
                                                    <div className="flex justify-center">
                                                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                                                            Lihat Dokumen
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8">
                                                    <div className="flex justify-center">
                                                        <button className="bg-indigo-500 text-white px-3 py-1 rounded text-sm font-medium">
                                                            Buat Kegiatan
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
                    {proposals.meta && proposals.meta.links && (
                        <div className="mt-6">
                            <Pagination links={proposals.meta.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}