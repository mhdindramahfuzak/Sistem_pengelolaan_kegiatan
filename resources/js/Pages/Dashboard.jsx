import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Registrasi komponen ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// --- KOLEKSI IKON ---
const UsersIcon = () => <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const FolderIcon = () => <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const BellIcon = () => <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ClockIcon = () => <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = () => <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DocumentCheckIcon = () => <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CalendarIcon = () => <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TrendingUpIcon = () => <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const StarIcon = () => <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const StatusIcon = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TeamIcon = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CalendarIconSmall = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const KegiatanIcon = () => <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

// --- KOMPONEN-KOMPONEN ---

const EventModal = ({ event, onClose }) => {
    if (!event) return null;
    const { title, start, url, extendedProps } = event;
    const formattedDate = new Date(start).toLocaleDateString("id-ID", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><CloseIcon /></button>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                    <div className="space-y-3 text-gray-700">
                        <p><CalendarIconSmall /> <span className="font-medium">{formattedDate}</span></p>
                        <p><TeamIcon /> Tim Pelaksana: <span className="font-medium">{extendedProps.tim}</span></p>
                        <p><StatusIcon /> Status: <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold ${extendedProps.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{extendedProps.status}</span></p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
                    <button onClick={() => router.visit(url)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Lihat Detail Lengkap</button>
                </div>
            </div>
        </div>
    );
};

const StatusKegiatanCard = ({ statusKegiatan }) => {
    const getStatusColor = (color) => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-800 border-blue-200',
            'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'orange': 'bg-orange-100 text-orange-800 border-orange-200',
            'purple': 'bg-purple-100 text-purple-800 border-purple-200',
            'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'green': 'bg-green-100 text-green-800 border-green-200',
            'gray': 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colorMap[color] || colorMap.gray;
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <KegiatanIcon />
                    <span className="ml-3">Status Kegiatan Terbaru</span>
                </h3>
                <Link href={route('kegiatan.index')} className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {statusKegiatan && statusKegiatan.length > 0 ? statusKegiatan.map((kegiatan) => (
                    <div key={kegiatan.id} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{kegiatan.nama_kegiatan}</h4>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(kegiatan.color)} flex-shrink-0`}>
                                {kegiatan.status_display}
                            </span>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                                <CalendarIconSmall />
                                <span className="ml-1">
                                    {new Date(kegiatan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <TeamIcon />
                                <span className="ml-1">{kegiatan.tim}</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <Link
                                // PERBAIKAN: Mengarahkan ke detail kegiatan, bukan arsip
                                href={route('kegiatan.index', kegiatan.id)}
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Lihat Detail
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12">
                        <KegiatanIcon />
                        <p className="text-gray-500 text-sm mt-2">Tidak ada kegiatan yang sedang berjalan</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (Komponen lainnya seperti JadwalCard, StatCard, dll. tetap sama) ...
const JadwalCard = ({ events, onEventClick }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 h-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIconSmall />
            <span className="ml-2">Jadwal Kegiatan Saya</span>
        </h3>
        <div className="h-[450px]">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                }}
                events={events}
                eventClick={onEventClick}
                locale="id"
                height="100%"
                dayMaxEvents={true}
                buttonText={{ today: 'hari ini' }}
                eventColor="#3B82F6"
            />
        </div>
    </div>
);

const StatCard = ({ title, value, icon, link, trend, trendValue, bgGradient = "from-blue-50 to-white" }) => (
    <Link href={link || '#'} className="block group">
        <div className={`bg-gradient-to-br ${bgGradient} overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full`}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-shrink-0">
                        <div className="p-3 bg-white rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">{icon}</div>
                    </div>
                    {trend && (
                        <div className={`text-right ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            <div className="flex items-center space-x-1"><span className="text-xs font-medium">{trendValue}</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} /></svg></div>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{value}</p>
                </div>
            </div>
        </div>
    </Link>
);

const ActivityCard = ({ activities }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center"><BellIcon /><span className="ml-3">Pengingat</span></h3>
            <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">Lihat Semua</Link>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities && activities.length > 0 ? activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0 mt-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12"><BellIcon /><p className="text-gray-500 text-sm mt-2">Tidak ada aktivitas terbaru</p></div>
            )}
        </div>
    </div>
);

const QuickActions = ({ user }) => {
    const getQuickActions = (role) => {
        const actions = {
            admin: [
                { title: 'Kelola Pengguna', icon: <UsersIcon />, link: '/user', color: 'from-cyan-500 to-blue-500' },
                { title: 'Lihat Proposal', icon: <FolderIcon />, link: '/proposal', color: 'from-indigo-500 to-purple-500' },
                { title: 'Kelola Kegiatan', icon: <ClockIcon />, link: '/kegiatan', color: 'from-yellow-500 to-orange-500' },
            ],
            kadis: [
                { title: 'Verifikasi Proposal', icon: <DocumentCheckIcon />, link: '/verifikasi-proposal', color: 'from-teal-500 to-cyan-500' },
                { title: 'Lihat Arsip', icon: <FolderIcon />, link: '/arsip', color: 'from-indigo-500 to-purple-500' },
                { title: 'Status Kegiatan', icon: <KegiatanIcon />, link: '/kegiatan', color: 'from-blue-500 to-indigo-500' },
            ],
            kabid: [
                { title: 'Bentuk Tim', icon: <UsersIcon />, link: '/tim', color: 'from-cyan-500 to-blue-500' },
                { title: 'Kelola Penyerahan', icon: <ClockIcon />, link: '/manajemen/penyerahan', color: 'from-yellow-500 to-orange-500' },
                { title: 'Status Kegiatan', icon: <KegiatanIcon />, link: '/kegiatan', color: 'from-blue-500 to-indigo-500' },
            ],
            pengusul: [
                { title: 'Buat Proposal', icon: <FolderIcon />, link: '/proposal/create', color: 'from-indigo-500 to-purple-500' },
                { title: 'Proposal Saya', icon: <DocumentCheckIcon />, link: '/proposal/my', color: 'from-teal-500 to-cyan-500' },
            ],
            pegawai: [
                { title: 'Tugas Saya', icon: <ClockIcon />, link: '/pegawai/kegiatan/my', color: 'from-yellow-500 to-orange-500' },
                { title: 'Jadwal Lengkap', icon: <CalendarIcon />, link: '/jadwal-kerja', color: 'from-purple-500 to-pink-500' },
            ]
        };
        return actions[role] || [];
    };

    const quickActions = getQuickActions(user.role);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
            <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                    <Link key={index} href={action.link} className="group">
                        <div className={`bg-gradient-to-r ${action.color} p-4 rounded-lg text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center space-x-3">
                                <div className="text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex-shrink-0">{action.icon}</div>
                                <span className="font-medium text-sm">{action.title}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const ChartCard = ({ title, chartData, type }) => {
    const baseOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: 'white', bodyColor: 'white', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false }, ticks: { color: '#6b7280', font: { size: 11 }, padding: 8 } }, x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 11 }, padding: 8 } } } };
    const getChartData = () => ({
        labels: chartData.labels,
        datasets: [{
            label: 'Jumlah',
            data: chartData.data,
            backgroundColor: type === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
            borderColor: type === 'line' ? 'rgba(16, 185, 129, 1)' : 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 6,
            tension: 0.4,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointHoverRadius: 6,
            fill: type === 'line',
        }],
    });

    const renderChart = () => {
        const data = getChartData();
        if (type === 'line') return <Line options={baseOptions} data={data} />;
        return <Bar options={baseOptions} data={data} />;
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
            <div className="h-80">{renderChart()}</div>
        </div>
    );
};


export default function Dashboard({ auth, stats, chartData, activities, events, statusKegiatan }) {
    const user = auth.user;
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault();
        setSelectedEvent(clickInfo.event);
    };

    const defaultActivities = [
        { title: 'Sudah Melakukan Kehadiran', time: '2 jam yang lalu' },
        { title: 'Melakukan kegiatam', time: '5 jam yang lalu' },
        { title: 'Selalu Ingatkan Pegawai Terkait', time: '1 hari yang lalu' },
        { title: 'Selesaikan Kegiatam', time: '2 hari yang lalu' },
    ];

    const renderStats = () => {
        const gradients = [ 'from-blue-50 to-cyan-50', 'from-indigo-50 to-purple-50', 'from-yellow-50 to-orange-50', 'from-green-50 to-emerald-50', 'from-red-50 to-pink-50', 'from-teal-50 to-cyan-50', 'from-purple-50 to-pink-50', 'from-orange-50 to-red-50', ];
        switch(user.role) {
            case 'admin': return ( <> <StatCard title="Total Pengguna" value={stats.total_pengguna} icon={<UsersIcon />} link={route('user.index')} bgGradient={gradients[0]} trend="up" trendValue="+12%" /> <StatCard title="Total Proposal" value={stats.total_proposal} icon={<FolderIcon />} link={route('proposal.index')} bgGradient={gradients[1]} trend="up" trendValue="+8%" /> <StatCard title="Total Kegiatan" value={stats.total_kegiatan} icon={<ClockIcon />} link={route('kegiatan.index')} bgGradient={gradients[2]} /> <StatCard title="Kegiatan Selesai" value={stats.kegiatan_selesai} icon={<CheckCircleIcon />} link={route('arsip.index')} bgGradient={gradients[3]} trend="up" trendValue="+15%" /> <StatCard title="Rating Kepuasan" value="4.8/5" icon={<StarIcon />} link="#" bgGradient={gradients[4]} /> <StatCard title="Proposal Bulan Ini" value={stats.proposal_bulan_ini || 0} icon={<DocumentCheckIcon />} link={route('proposal.index')} bgGradient={gradients[5]} /> </> );
            case 'kadis': return ( <> <StatCard title="Proposal Perlu Verifikasi" value={stats.proposal_perlu_verifikasi} icon={<DocumentCheckIcon />} link={route('verifikasi.proposal.index')} bgGradient={gradients[0]} /> <StatCard title="Proposal Sudah Diverifikasi" value={stats.proposal_sudah_diverifikasi} icon={<CheckCircleIcon />} link={route('verifikasi.proposal.index')} bgGradient={gradients[1]} /> <StatCard title="Total Kegiatan Berjalan" value={stats.total_kegiatan_berjalan} icon={<ClockIcon />} link={route('kegiatan.index')} bgGradient={gradients[2]} /> <StatCard title="Total Arsip Kegiatan" value={stats.total_arsip} icon={<FolderIcon />} link={route('arsip.index')} bgGradient={gradients[3]} /> </> );
            case 'kabid': return ( <> <StatCard title="Proposal Siap Dibuat Kegiatan" value={stats.proposal_siap_dibuat_kegiatan} icon={<DocumentCheckIcon />} link={route('kabid.proposal.index')} bgGradient={gradients[0]} /> <StatCard title="Total Tim Dibentuk" value={stats.total_tim_dibentuk} icon={<UsersIcon />} link={route('tim.index')} bgGradient={gradients[1]} /> <StatCard title="Kegiatan Menunggu Penyerahan" value={stats.kegiatan_menunggu_penyerahan} icon={<ClockIcon />} link={route('manajemen.penyerahan.index')} bgGradient={gradients[2]} /> <StatCard title="Total Kegiatan Dikelola" value={stats.total_kegiatan_dikelola} icon={<FolderIcon />} link={route('kegiatan.index')} bgGradient={gradients[3]} /> </> );
            case 'pengusul': return ( <> <StatCard title="Proposal Diajukan" value={stats.proposal_diajukan} icon={<FolderIcon />} link={route('proposal.myIndex')} bgGradient={gradients[0]} /> <StatCard title="Proposal Disetujui" value={stats.proposal_disetujui} icon={<CheckCircleIcon />} link={route('proposal.myIndex')} bgGradient={gradients[2]} /> <StatCard title="Proposal Ditolak" value={stats.proposal_ditolak} icon={<XCircleIcon />} link={route('proposal.myIndex')} bgGradient={gradients[3]} /> <StatCard title="Tingkat Persetujuan" value={`${Math.round((stats.proposal_disetujui / (stats.proposal_disetujui + stats.proposal_ditolak) * 100) || 0)}%`} icon={<TrendingUpIcon />} link="#" bgGradient={gradients[4]} /> </> );
            case 'pegawai': return ( <> <StatCard title="Tugas Aktif" value={stats.tugas_aktif} icon={<ClockIcon />} link={route('pegawai.kegiatan.myIndex')} bgGradient={gradients[0]} /> <StatCard title="Tugas Selesai" value={stats.tugas_selesai} icon={<CheckCircleIcon />} link={route('pegawai.kegiatan.myIndex', { tahapan: 'selesai' })} bgGradient={gradients[1]} /> <StatCard title="Tugas jadwal" value={stats.tugas_mendatang||'Lihat jadwal'} icon={<CalendarIcon />} link={route('jadwal.index')} bgGradient={gradients[2]} /> <StatCard title="Produktivitas" value="95%" icon={<TrendingUpIcon />} link="#" bgGradient={gradients[3]} /> </> );
            default: return <div className="col-span-full p-6 text-gray-900 bg-white rounded-xl shadow-lg">Tidak ada data statistik untuk ditampilkan.</div>;
        }
    }

    const renderCharts = () => {
        if (!chartData || Object.keys(chartData).length === 0) return null;

        const chartTitles = {
            proposal: "Grafik Proposal Masuk",
            kegiatan: "Grafik Kegiatan Berjalan",
            proposal_verification: "Grafik Verifikasi Proposal",
            kegiatan_dibuat: "Grafik Pembuatan Kegiatan",
            my_proposals: "Grafik Pengajuan Proposal Saya",
            my_kegiatan: "Grafik Tugas Kegiatan Saya",
        };

        return Object.entries(chartData).flatMap(([key, data]) => [
            <ChartCard
                key={`${key}-bar`}
                title={`${chartTitles[key] || "Grafik Data"} (Batang)`}
                chartData={data}
                type="bar"
            />,
            <ChartCard
                key={`${key}-line`}
                title={`${chartTitles[key] || "Grafik Data"} (Garis)`}
                chartData={data}
                type="line"
            />
        ]);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-white leading-tight">Dashboard</h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden shadow-xl sm:rounded-2xl mb-8">
                        <div className="p-8 text-white">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Selamat datang kembali, {user.name}! 👋</h1>
                                    <p className="text-blue-100 text-lg capitalize">Role: {user.role}</p>
                                    <p className="text-blue-200 mt-2">Semoga hari Anda produktif dan menyenangkan</p>
                                </div>
                                <div className="mt-4 lg:mt-0 lg:ml-8 flex-shrink-0">
                                    <div className="text-right bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="text-4xl font-bold">{new Date().getDate()}</div>
                                        <div className="text-blue-100 text-sm">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 mb-8">{renderStats()}</div>

                    {/* Secondary Content Grid - Updated Logic */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
                        <div className="xl:col-span-1"><QuickActions user={user} /></div>
                        {user.role === 'pegawai' ? (
                            <>
                                <div className="xl:col-span-2"><JadwalCard events={events} onEventClick={handleEventClick} /></div>
                                <div className="xl:col-span-2"><ActivityCard activities={activities || defaultActivities} /></div>
                            </>
                        ) : user.role === 'kadis' || user.role === 'kabid' ? (
                            <div className="xl:col-span-4"><StatusKegiatanCard statusKegiatan={statusKegiatan} /></div>
                        ) : (
                            <div className="xl:col-span-4"><ActivityCard activities={activities || defaultActivities} /></div>
                        )}
                    </div>

                    {/* Charts Section */}
                    {chartData && Object.keys(chartData).length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Analisis Data</h2>
                                    <p className="text-gray-600 mt-1">Visualisasi data statistik sistem</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {renderCharts()}
                            </div>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2"><svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg><h3 className="text-lg font-semibold text-gray-900">DISKP Management System</h3></div>
                            <p className="text-gray-500 text-sm">Sistem Management Proposal & Kegiatan Dinas Kelautan dan Perikanan</p>
                            <p className="text-gray-400 text-xs mt-2">© 2024 - Semua hak dilindungi</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
