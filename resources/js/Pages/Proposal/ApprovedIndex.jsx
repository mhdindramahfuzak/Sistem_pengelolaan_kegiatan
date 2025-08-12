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
                                        <tr>
                                            <td colSpan="7" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500 text-lg font-medium">
                                                        Belum ada proposal yang disetujui.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {proposals.meta && proposals.meta.links && proposals.data && proposals.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination links={proposals.meta.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}