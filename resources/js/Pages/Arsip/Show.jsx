import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Komponen kecil untuk menampilkan baris detail
const DetailRow = ({ label, value, isFile = false, fileUrl, emptyMessage = "Data tidak ditemukan" }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200">
        <dt className="font-medium text-gray-600">{label}</dt>
        <dd className="col-span-2 text-gray-800">
            {isFile && fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat Dokumen
                </a>
            ) : isFile && !fileUrl ? (
                <span className="text-gray-500 italic">Data tidak tersimpan</span>
            ) : value ? (
                value
            ) : (
                <span className="text-gray-500 italic">{emptyMessage}</span>
            )}
        </dd>
    </div>
);

// Komponen untuk menampilkan bagian/section
const DetailSection = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
            {title}
        </h3>
        <dl className="space-y-1">{children}</dl>
    </div>
);

export default function Show({ auth, kegiatan }) {
    const { data } = kegiatan;

    const dokObservasi = data.dokumentasi?.find(d => d.tipe === 'observasi');
    const dokPenyerahan = data.dokumentasi?.find(d => d.tipe === 'penyerahan');
    const beritaAcara = data.berita_acara;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Arsip Kegiatan: {data.nama_kegiatan || 'Kegiatan Tidak Diketahui'}</h2>}
        >
            <Head title={"Detail Arsip " + (data.nama_kegiatan || 'Kegiatan')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900">
                            <Link href={route('arsip.index')} className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
                                ← Kembali ke Arsip
                            </Link>

                            <DetailSection title="Informasi Umum Kegiatan">
                                <DetailRow 
                                    label="Nama Kegiatan" 
                                    value={data.nama_kegiatan} 
                                    emptyMessage="Nama kegiatan belum diisi"
                                />
                                <DetailRow 
                                    label="Deskripsi" 
                                    value={data.ket_kegiatan}
                                    emptyMessage="Deskripsi kegiatan belum tersedia"
                                />
                                <DetailRow 
                                    label="Tanggal Kegiatan" 
                                    value={data.tanggal_kegiatan ? new Date(data.tanggal_kegiatan).toLocaleDateString("id-ID") : null}
                                    emptyMessage="Tanggal kegiatan belum ditentukan"
                                />
                                <DetailRow 
                                    label="Tim Pelaksana" 
                                    value={data.tim?.nama_tim}
                                    emptyMessage="Tim pelaksana belum ditentukan"
                                />
                                <DetailRow 
                                    label="Anggota Tim" 
                                    value={data.tim?.users?.length > 0 ? data.tim.users.map(p => p.name).join(', ') : null}
                                    emptyMessage="Anggota tim belum ditentukan"
                                />
                                <DetailRow 
                                    label="File SKTL Observasi" 
                                    isFile={true} 
                                    fileUrl={data.sktl_url}
                                />
                            </DetailSection>

                            {data.proposal ? (
                                <DetailSection title="Detail Proposal Terkait">
                                    <DetailRow 
                                        label="Nama Proposal" 
                                        value={data.proposal.nama_proposal}
                                        emptyMessage="Nama proposal belum diisi"
                                    />
                                    <DetailRow 
                                        label="Pengusul" 
                                        value={data.proposal.pengusul?.name}
                                        emptyMessage="Pengusul belum ditentukan"
                                    />
                                    <DetailRow 
                                        label="Tujuan" 
                                        value={data.proposal.tujuan}
                                        emptyMessage="Tujuan proposal belum diisi"
                                    />
                                    <DetailRow 
                                        label="Dokumen Proposal" 
                                        isFile={true} 
                                        fileUrl={data.proposal.dokumen_url}
                                    />
                                </DetailSection>
                            ) : (
                                <DetailSection title="Detail Proposal Terkait">
                                    <div className="text-gray-500 italic py-4">
                                        Tidak ada proposal yang terkait dengan kegiatan ini
                                    </div>
                                </DetailSection>
                            )}

                            {dokObservasi ? (
                                <DetailSection title="Dokumentasi Observasi">
                                    <DetailRow 
                                        label="Judul Dokumentasi" 
                                        value={dokObservasi.nama_dokumentasi}
                                        emptyMessage="Judul dokumentasi belum diisi"
                                    />
                                    <DetailRow 
                                        label="Deskripsi/Catatan" 
                                        value={dokObservasi.deskripsi}
                                        emptyMessage="Deskripsi dokumentasi belum diisi"
                                    />
                                    {dokObservasi.fotos?.length > 0 ? (
                                        <div className="py-2">
                                            <p className="font-medium text-gray-600 mb-2">Foto-foto Observasi:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {dokObservasi.fotos.map(foto => (
                                                    <a key={foto.id} href={foto.file_path} target="_blank" rel="noopener noreferrer">
                                                        <img src={foto.file_path} alt="Dokumentasi Observasi" className="rounded-lg shadow-md object-cover h-40 w-full"/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <p className="font-medium text-gray-600 mb-2">Foto-foto Observasi:</p>
                                            <div className="text-gray-500 italic">
                                                Belum ada foto dokumentasi observasi
                                            </div>
                                        </div>
                                    )}
                                </DetailSection>
                            ) : (
                                <DetailSection title="Dokumentasi Observasi">
                                    <div className="text-gray-500 italic py-4">
                                        Dokumentasi observasi belum tersedia
                                    </div>
                                </DetailSection>
                            )}

                            {dokPenyerahan ? (
                                <DetailSection title="Dokumentasi Penyerahan">
                                    <DetailRow 
                                        label="Judul Dokumentasi" 
                                        value={dokPenyerahan.nama_dokumentasi}
                                        emptyMessage="Judul dokumentasi belum diisi"
                                    />
                                    <DetailRow 
                                        label="Deskripsi/Catatan" 
                                        value={dokPenyerahan.deskripsi}
                                        emptyMessage="Deskripsi dokumentasi belum diisi"
                                    />
                                    <DetailRow 
                                        label="File SKTL Penyerahan" 
                                        isFile={true} 
                                        fileUrl={data.sktl_penyerahan_path}
                                    />
                                    {data.kontrak && (
                                        <DetailRow 
                                            label="Kontrak Pihak Ketiga" 
                                            isFile={true} 
                                            fileUrl={data.kontrak.file_path}
                                        />
                                    )}
                                    {dokPenyerahan.fotos?.length > 0 ? (
                                        <div className="py-2">
                                            <p className="font-medium text-gray-600 mb-2">Foto-foto Penyerahan:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {dokPenyerahan.fotos.map(foto => (
                                                    <a key={foto.id} href={foto.file_path} target="_blank" rel="noopener noreferrer">
                                                        <img src={foto.file_path} alt="Dokumentasi Penyerahan" className="rounded-lg shadow-md object-cover h-40 w-full"/>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <p className="font-medium text-gray-600 mb-2">Foto-foto Penyerahan:</p>
                                            <div className="text-gray-500 italic">
                                                Belum ada foto dokumentasi penyerahan
                                            </div>
                                        </div>
                                    )}
                                </DetailSection>
                            ) : (
                                <DetailSection title="Dokumentasi Penyerahan">
                                    <div className="text-gray-500 italic py-4">
                                        Dokumentasi penyerahan belum tersedia
                                    </div>
                                </DetailSection>
                            )}

                            {beritaAcara ? (
                                <DetailSection title="Laporan Akhir (Penyelesaian)">
                                    <DetailRow 
                                        label="Status Akhir" 
                                        value={data.status_akhir}
                                        emptyMessage="Status akhir belum ditentukan"
                                    />
                                    <DetailRow 
                                        label="Tanggal Selesai" 
                                        value={data.updated_at ? new Date(data.updated_at).toLocaleDateString("id-ID") : null}
                                        emptyMessage="Tanggal penyelesaian belum tercatat"
                                    />
                                    <DetailRow 
                                        label="File Berita Acara" 
                                        isFile={true} 
                                        fileUrl={beritaAcara.file_url}
                                    />
                                </DetailSection>
                            ) : (
                                <DetailSection title="Laporan Akhir (Penyelesaian)">
                                    <div className="text-gray-500 italic py-4">
                                        Laporan akhir kegiatan belum tersedia
                                    </div>
                                </DetailSection>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}