import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function ApprovedIndex({ auth, proposals, success }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            // PERBAIKAN: Mengubah warna teks judul menjadi putih
            header={<h2 className="font-semibold text-xl text-white leading-tight">Proposal Disetujui</h2>}
        >
            <Head title="Proposal Disetujui" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
                            {success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-white uppercase" style={{ backgroundColor: '#25335C' }}>
                                        <tr>
                                            <th className="px-3 py-3">Nama Proposal</th>
                                            <th className="px-3 py-3">Nama Pengusul</th>
                                            <th className="px-3 py-3">Tanggal Disetujui</th>
                                            <th className="px-3 py-3">Status</th>
                                            <th className="px-3 py-3 text-center">Dokumen Proposal</th>
                                            <th className="px-3 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proposals.data.map((proposal) => (
                                            <tr key={proposal.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-3 py-2 font-medium text-gray-900">
                                                    {proposal.nama_proposal}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {proposal.pengusul.name}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {new Date(proposal.created_at).toLocaleDateString("id-ID")}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                                                        {proposal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <a
                                                        href={proposal.dokumen_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        Lihat Dokumen
                                                    </a>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <Link
                                                        href={route('kegiatan.create', { proposal_id: proposal.id })}
                                                        className="font-medium text-indigo-600 hover:underline mx-1"
                                                    >
                                                        Buat Kegiatan
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={proposals.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
