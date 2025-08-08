import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Komponen untuk kartu statistik
const StatCard = ({ title, value, description }) => (
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
    </div>
);


export default function Dashboard({ auth, stats }) {
    const user = auth.user;

    // Fungsi untuk me-render statistik berdasarkan peran
    const renderStats = () => {
        switch(user.role) {
            case 'admin':
                return (
                    <>
                        <StatCard title="Total Proposal" value={stats.total_proposal} />
                        <StatCard title="Proposal Menunggu Persetujuan" value={stats.proposal_menunggu} />
                        <StatCard title="Total Kegiatan" value={stats.total_kegiatan} />
                        <StatCard title="Kegiatan Sedang Berjalan" value={stats.kegiatan_berjalan} />
                    </>
                );
            case 'kadis':
                return <StatCard title="Proposal Perlu Verifikasi" value={stats.proposal_perlu_verifikasi} />;
            case 'kabid':
                return (
                    <>
                        <StatCard title="Proposal Disetujui (Siap Dibuat Kegiatan)" value={stats.proposal_disetujui} />
                        <StatCard title="Total Kegiatan Dibuat" value={stats.kegiatan_dibuat} />
                    </>
                );
            case 'pengusul':
                 return (
                    <>
                        <StatCard title="Total Proposal Diajukan" value={stats.proposal_diajukan} />
                        <StatCard title="Proposal Disetujui" value={stats.proposal_disetujui} />
                        <StatCard title="Proposal Ditolak" value={stats.proposal_ditolak} />
                    </>
                );
            case 'pegawai':
                return (
                    <>
                        <StatCard title="Tugas Aktif" value={stats.tugas_aktif} description="Kegiatan yang sedang berjalan." />
                        <StatCard title="Tugas Selesai" value={stats.tugas_selesai} description="Kegiatan yang telah diselesaikan." />
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Selamat datang kembali, {user.name}!</div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {renderStats()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
