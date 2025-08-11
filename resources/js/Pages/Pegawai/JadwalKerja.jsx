import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// PERBAIKAN: Plugin 'list' dihapus untuk sementara karena belum diinstal
// import listPlugin from '@fullcalendar/list'; 

// Komponen Ikon sederhana
const CalendarIcon = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TeamIcon = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const StatusIcon = () => <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// Komponen Modal untuk Detail Acara
const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const { title, start, url, extendedProps } = event;
    const formattedDate = new Date(start).toLocaleDateString("id-ID", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all"
                onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat konten di-klik
            >
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                    
                    <div className="space-y-3 text-gray-700">
                        <p><CalendarIcon /> <span className="font-medium">{formattedDate}</span></p>
                        <p><TeamIcon /> Tim Pelaksana: <span className="font-medium">{extendedProps.tim}</span></p>
                        <p><StatusIcon /> Status: 
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold ${extendedProps.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {extendedProps.status}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
                    <button 
                        onClick={() => router.visit(url)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Lihat Detail Lengkap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function JadwalKerja({ auth, events }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fungsi ketika event di kalender di-klik
    const handleEventClick = (clickInfo) => {
        // Mencegah navigasi default dari 'url' event
        clickInfo.jsEvent.preventDefault(); 
        setSelectedEvent(clickInfo.event);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Jadwal Kerja Pegawai</h2>}
        >
            <Head title="Jadwal Kerja" />

            {/* Modal akan muncul di sini */}
            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-2xl p-4 md:p-6">
                        
                        {/* Legenda Warna */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                                <span className="text-sm text-gray-600">Kegiatan Aktif</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                                <span className="text-sm text-gray-600">Kegiatan Selesai</span>
                            </div>
                        </div>

                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            locale="id" // Menggunakan bahasa Indonesia
                            buttonText={{
                                today:    'hari ini',
                                month:    'bulan',
                                week:     'minggu',
                                day:      'hari',
                            }}
                            height="auto"
                            contentHeight="auto"
                            aspectRatio={1.8}
                            eventTimeFormat={{ // Format waktu jika ada
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            dayMaxEvents={true} // Menampilkan "+ more" jika terlalu banyak event
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
