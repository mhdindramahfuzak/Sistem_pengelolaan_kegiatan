import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';

export default function MyIndex({ auth, proposals }) {
    // PERBAIKAN: Defensive programming untuk data yang mungkin undefined
    const proposalsList = proposals?.data || [];
    const paginationLinks = proposals?.meta?.links || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center px-6">
                    <h2 className="font-semibold text-xl text-white leading-tight">Proposal Saya</h2>
                </div>
            }
        >
            <Head title="Proposal Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header section dengan tombol dan title "Proposal" sejajar */}
                    <div className="mb-8 flex justify-between items-center">
                        <Link href={route('proposal.create')}>
                            <PrimaryButton 
                                className="text-white px-4 py-2 rounded text-sm"
                                style={{ backgroundColor: '#25335C', ':hover': { backgroundColor: '#1e2a4a' } }}
                            >
                                + AJUKAN PROPOSAL
                            </PrimaryButton>
                        </Link>
                        <h3 className="text-2xl font-semibold text-gray-900 flex-1 text-center">Proposal</h3>
                        <div className="w-32"></div> {/* Spacer with same width as button for balance */}
                    </div>

                    {/* Table dengan styling yang sesuai dengan warna #25335C */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: '#25335C' }} className="text-white">
                                    <th className="px-6 py-4 text-left font-medium text-base border-r border-opacity-30" 
                                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                                        Nama Proposal
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium text-base border-r border-opacity-30"
                                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                                        Tanggal Diajukan
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium text-base">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {proposalsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500 text-lg">
                                            Anda belum mengajukan proposal apapun.
                                        </td>
                                    </tr>
                                ) : (
                                    proposalsList.map((proposal, index) => (
                                        <tr 
                                            key={proposal.id} 
                                            className={`border-b border-gray-200 hover:bg-gray-50 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-gray-900 font-medium border-r border-gray-200">
                                                {proposal.nama_proposal || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 border-r border-gray-200">
                                                {proposal.tanggal_pengajuan || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-2 rounded-md text-white text-sm font-medium inline-block ${
                                                    proposal.status === 'disetujui' ? 'bg-green-500' :
                                                    proposal.status === 'ditolak' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}>
                                                    {proposal.status === 'disetujui' ? 'disetujui' :
                                                     proposal.status === 'ditolak' ? 'ditolak' : 'pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination dengan styling yang sesuai */}
                    {paginationLinks.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination links={paginationLinks} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}