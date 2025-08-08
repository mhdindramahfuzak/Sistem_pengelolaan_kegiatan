import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';

export default function MyIndex({ auth, proposals }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Proposal Saya</h2>
                    <Link href={route('proposal.create')}>
                        <PrimaryButton>Ajukan Proposal Baru</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Proposal Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Proposal</th>
                                            <th className="px-6 py-3">Tanggal Diajukan</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proposals.data.map((proposal) => (
                                            <tr key={proposal.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium text-gray-900">{proposal.nama_proposal}</td>
                                                <td className="px-6 py-4">{proposal.tanggal_pengajuan}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-white text-xs ${
                                                        proposal.status === 'disetujui' ? 'bg-green-500' :
                                                        proposal.status === 'ditolak' ? 'bg-red-500' : 'bg-yellow-500'
                                                    }`}>
                                                        {proposal.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {proposals.data.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center">Anda belum mengajukan proposal apapun.</td>
                                            </tr>
                                        )}
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
