// File: resources/js/Pages/Arsip/Show.jsx
// Enhanced mobile-friendly design with interactive features

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Icon components (using simple SVG)
const ChevronDownIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const DocumentIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const PhotoIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

// Enhanced detail row with better mobile layout
const DetailRow = ({ icon: Icon, label, value, isFile = false, fileUrl, emptyMessage = "Data tidak tersedia", className = "" }) => (
    <div className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 ${className}`}>
        <div className="flex items-start space-x-3">
            {Icon && <Icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
                <dd className="text-sm text-gray-900">
                    {isFile && fileUrl ? (
                        <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                            <DocumentIcon className="w-4 h-4" />
                            <span>Lihat Dokumen</span>
                        </a>
                    ) : isFile && !fileUrl ? (
                        <span className="text-gray-500 italic">Tidak tersimpan</span>
                    ) : value ? (
                        <span className="break-words">{value}</span>
                    ) : (
                        <span className="text-gray-500 italic">{emptyMessage}</span>
                    )}
                </dd>
            </div>
        </div>
    </div>
);

// Collapsible section component
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 flex items-center justify-between text-left"
            >
                <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-6 space-y-4 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

// Photo gallery component
const PhotoGallery = ({ photos, title }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (!photos || photos.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada foto</p>
            </div>
        );
    }

    return (
        <div>
            <h5 className="flex items-center space-x-2 font-medium text-gray-700 mb-4">
                <PhotoIcon className="w-5 h-5" />
                <span>{title} ({photos.length} foto)</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((foto, index) => (
                    <button
                        key={foto.id || index}
                        onClick={() => setSelectedPhoto(foto)}
                        className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <img 
                            src={foto.file_path} 
                            alt={`${title} ${index + 1}`}
                            className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                    </button>
                ))}
            </div>

            {/* Photo modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                    <div className="relative max-w-4xl max-h-full">
                        <img 
                            src={selectedPhoto.file_path} 
                            alt="Foto detail"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button 
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Status badge component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const configs = {
            'selesai': { color: 'bg-green-100 text-green-800', label: 'Selesai' },
            'ditunda': { color: 'bg-yellow-100 text-yellow-800', label: 'Ditunda' },
            'dibatalkan': { color: 'bg-red-100 text-red-800', label: 'Dibatalkan' }
        };
        return configs[status] || { color: 'bg-gray-100 text-gray-800', label: status || 'Belum ditentukan' };
    };

    const config = getStatusConfig(status);
    
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};

export default function Show({ auth, kegiatan }) {
    const { data } = kegiatan;

    const dokObservasi = data.dokumentasi?.find(d => d.tipe === 'observasi');
    const dokPenyerahan = data.dokumentasi?.find(d => d.tipe === 'penyerahan');
    const beritaAcara = data.berita_acara;

    const formatTanggal = (tanggal) => {
        if (!tanggal) return null;
        try {
            return new Date(tanggal).toLocaleDateString("id-ID", {
                weekday: 'long',
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return tanggal;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-xl text-white leading-tight truncate">
                            Detail Arsip: {data.nama_kegiatan || 'Kegiatan Tidak Diketahui'}
                        </h2>
                        <p className="text-sm text-gray-200 mt-1">
                            {formatTanggal(data.tanggal_kegiatan) || 'Tanggal tidak tersedia'}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={data.status_akhir} />
                    </div>
                </div>
            }
        >
            <Head title={`Detail Arsip - ${data.nama_kegiatan || 'Kegiatan'}`} />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <Link 
                        href={route('arsip.index')} 
                        className="mb-6 inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Kembali ke Arsip</span>
                    </Link>

                    {/* Main content */}
                    <div className="space-y-6">
                        {/* Informasi Umum */}
                        <CollapsibleSection title="Informasi Kegiatan" icon={CalendarIcon}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <DetailRow 
                                    icon={CalendarIcon}
                                    label="Nama Kegiatan" 
                                    value={data.nama_kegiatan} 
                                />
                                <DetailRow 
                                    icon={CalendarIcon}
                                    label="Tanggal Kegiatan" 
                                    value={formatTanggal(data.tanggal_kegiatan)} 
                                />
                                <div className="lg:col-span-2">
                                    <DetailRow 
                                        label="Deskripsi Kegiatan" 
                                        value={data.ket_kegiatan} 
                                        emptyMessage="Deskripsi kegiatan belum tersedia" 
                                    />
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* Tim Pelaksana */}
                        <CollapsibleSection title="Tim Pelaksana" icon={UsersIcon}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <DetailRow 
                                    icon={UsersIcon}
                                    label="Nama Tim" 
                                    value={data.tim?.nama_tim} 
                                />
                                <DetailRow 
                                    icon={UsersIcon}
                                    label="Anggota Tim" 
                                    value={data.tim?.users?.map(p => p.name).join(', ')} 
                                    emptyMessage="Anggota tim tidak ditemukan" 
                                />
                            </div>
                        </CollapsibleSection>

                        {/* Proposal */}
                        <CollapsibleSection title="Proposal Terkait" icon={DocumentIcon}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <DetailRow 
                                    icon={DocumentIcon}
                                    label="Nama Proposal" 
                                    value={data.proposal?.nama_proposal} 
                                />
                                <DetailRow 
                                    icon={UsersIcon}
                                    label="Pengusul" 
                                    value={data.proposal?.pengusul?.name} 
                                />
                                <div className="lg:col-span-2">
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="Tujuan" 
                                        value={data.proposal?.tujuan} 
                                    />
                                </div>
                                <DetailRow 
                                    icon={DocumentIcon}
                                    label="Dokumen Proposal" 
                                    isFile={true} 
                                    fileUrl={data.proposal?.dokumen_url} 
                                />
                            </div>
                        </CollapsibleSection>

                        {/* Dokumentasi Observasi */}
                        <CollapsibleSection title="Dokumentasi Observasi" icon={PhotoIcon}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="File SKTL Observasi" 
                                        isFile={true} 
                                        fileUrl={data.sktl_url} 
                                    />
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="Judul Dokumentasi" 
                                        value={dokObservasi?.nama_dokumentasi} 
                                    />
                                </div>

                                {/* Data Kebutuhan */}
                                {dokObservasi?.kebutuhans?.length > 0 && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-800 mb-4">Data Kebutuhan</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {dokObservasi.kebutuhans.map((item, index) => (
                                                <div key={item.id || index} className="bg-white rounded-lg p-4 shadow-sm">
                                                    <h6 className="font-medium text-gray-800 mb-2">{item.nama_kebutuhan}</h6>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p>Jumlah: <span className="font-medium">{item.jumlah} {item.satuan}</span></p>
                                                        <p>Harga Satuan: <span className="font-medium">{formatCurrency(item.harga_satuan)}</span></p>
                                                        <p className="text-green-600 font-semibold">
                                                            Total: {formatCurrency(item.total || (item.jumlah * item.harga_satuan))}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Foto Observasi */}
                                <PhotoGallery photos={dokObservasi?.fotos} title="Foto Observasi" />
                            </div>
                        </CollapsibleSection>

                        {/* Dokumentasi Penyerahan */}
                        <CollapsibleSection title="Dokumentasi Penyerahan" icon={PhotoIcon}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="Judul Dokumentasi" 
                                        value={dokPenyerahan?.nama_dokumentasi} 
                                    />
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="File SKTL Penyerahan" 
                                        isFile={true} 
                                        fileUrl={data.sktl_penyerahan_url} 
                                    />
                                    <DetailRow 
                                        icon={DocumentIcon}
                                        label="Kontrak Pihak Ketiga" 
                                        isFile={true} 
                                        fileUrl={data.kontrak?.file_url} 
                                    />
                                </div>

                                {/* Foto Penyerahan */}
                                <PhotoGallery photos={dokPenyerahan?.fotos} title="Foto Penyerahan" />
                            </div>
                        </CollapsibleSection>

                        {/* Laporan Akhir */}
                        <CollapsibleSection title="Laporan Akhir" icon={DocumentIcon}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                                    <CalendarIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-600 mb-1">Status Akhir</dt>
                                        <dd>
                                            <StatusBadge status={data.status_akhir} />
                                        </dd>
                                    </div>
                                </div>
                                <DetailRow 
                                    icon={CalendarIcon}
                                    label="Tanggal Selesai" 
                                    value={formatTanggal(data.updated_at)} 
                                />
                                <DetailRow 
                                    icon={DocumentIcon}
                                    label="File Berita Acara" 
                                    isFile={true} 
                                    fileUrl={beritaAcara?.file_url || (beritaAcara?.file_path ? `/storage/${beritaAcara.file_path}` : null)} 
                                />
                            </div>
                        </CollapsibleSection>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}