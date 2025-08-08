import { useState } from "react";
import PegawaiLayout from "@/Layouts/PegawaiLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";

export default function MyIndex({ auth, kegiatans, queryParams = {}, success }) {
    queryParams = queryParams || {};

    const [modalState, setModalState] = useState({ type: null, kegiatan: null });

    const { post: postConfirm, processing: processingConfirm } = useForm();
    const { data: docsData, setData: setDocsData, post: postDocs, processing: processingDocs, errors: docsErrors, reset: resetDocs } = useForm({
        catatan_kebutuhan: '', detail_pelaksanaan: '', fotos: [],
    });
    const { data: penyerahanData, setData: setPenyerahanData, post: postPenyerahan, processing: processingPenyerahan, errors: penyerahanErrors, reset: resetPenyerahan } = useForm({
        nama_dokumentasi: '', file_sktl_penyerahan: null, file_kontrak: null,
    });
    const { data: penyelesaianData, setData: setPenyelesaianData, post: postPenyelesaian, processing: processingPenyelesaian, errors: penyelesaianErrors, reset: resetPenyelesaian } = useForm({
        file_berita_acara: null, detail_akhir_kegiatan: '', status_akhir: 'Selesai',
    });

    const searchFieldChanged = (name, value) => {
        queryParams[name] = value ? value : delete queryParams[name];
        router.get(route("kegiatan.myIndex"), queryParams, { preserveState: true, replace: true });
    };

    const handleTabClick = (tahapan) => searchFieldChanged('tahapan', tahapan);

    const getButtonTabClass = (tahapan) => {
        const currentTahapan = queryParams.tahapan || 'perjalanan_dinas';
        return `px-5 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            currentTahapan === tahapan
                ? 'text-white bg-blue-700 hover:bg-blue-800'
                : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
        }`;
    }

    const openModal = (type, kegiatan) => setModalState({ type, kegiatan });
    const closeModal = () => {
        setModalState({ type: null, kegiatan: null });
        resetDocs();
        resetPenyerahan();
        resetPenyelesaian();
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        postConfirm(route('kegiatan.confirmKehadiran', modalState.kegiatan.id), { onSuccess: closeModal });
    };
    const handleDocsSubmit = (e) => {
        e.preventDefault();
        postDocs(route('dokumentasi.observasi.store', modalState.kegiatan.id), { onSuccess: closeModal });
    };
    const handlePenyerahanSubmit = (e) => {
        e.preventDefault();
        postPenyerahan(route('dokumentasi.penyerahan.store', modalState.kegiatan.id), { onSuccess: closeModal });
    };
    const handlePenyelesaianSubmit = (e) => {
        e.preventDefault();
        postPenyelesaian(route('kegiatan.selesaikan', modalState.kegiatan.id), { onSuccess: closeModal });
    };

    const renderAksiButton = (kegiatan) => {
        switch (kegiatan.tahapan) {
            case 'perjalanan_dinas':
                return <button onClick={() => openModal('confirm', kegiatan)} className="font-medium text-white bg-teal-500 hover:bg-teal-600 py-2 px-4 rounded-lg text-nowrap">Konfirmasi Kehadiran</button>;
            case 'dokumentasi_observasi':
                return <button onClick={() => openModal('docs', kegiatan)} className="font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg text-nowrap">Lakukan Dokumentasi</button>;
            case 'menunggu_penyerahan':
                return <button onClick={() => openModal('penyerahan', kegiatan)} className="font-medium text-white bg-purple-500 hover:bg-purple-600 py-2 px-4 rounded-lg text-nowrap">Lakukan Penyerahan</button>;
            case 'penyelesaian':
                return <button onClick={() => openModal('penyelesaian', kegiatan)} className="font-medium text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg text-nowrap">Selesaikan Kegiatan</button>;
            default:
                return <Link href={route('arsip.show', kegiatan.id)} className="font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg text-nowrap">Lihat Detail</Link>;
        }
    };

    return (
        <PegawaiLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Kegiatan Saya</h2>}>
            <Head title="Daftar Kegiatan Saya" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <div className="bg-emerald-500 py-2 px-4 rounded-md text-white mb-4">{success}</div>}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex flex-wrap gap-2">
                                <button onClick={() => handleTabClick('perjalanan_dinas')} className={getButtonTabClass('perjalanan_dinas')}>Perjalanan Dinas</button>
                                <button onClick={() => handleTabClick('dokumentasi_observasi')} className={getButtonTabClass('dokumentasi_observasi')}>Dokumentasi Observasi</button>
                                <button onClick={() => handleTabClick('menunggu_penyerahan')} className={getButtonTabClass('menunggu_penyerahan')}>Dokumentasi Penyerahan</button>
                                <button onClick={() => handleTabClick('penyelesaian')} className={getButtonTabClass('penyelesaian')}>Penyelesaian</button>
                                <button onClick={() => handleTabClick('selesai')} className={getButtonTabClass('selesai')}>Selesai</button>
                            </div>
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-100 uppercase bg-blue-900">
                                        <tr className="text-nowrap">
                                            <th className="px-4 py-3">No</th>
                                            <th className="px-4 py-3">Nama Kegiatan</th>
                                            <th className="px-4 py-3">Proposal</th>
                                            <th className="px-4 py-3">Tanggal</th>
                                            <th className="px-4 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kegiatans.data.map((kegiatan, index) => (
                                            <tr key={kegiatan.id} className="bg-white border-b">
                                                <td className="px-4 py-2">{index + kegiatans.meta.from}</td>
                                                <td className="px-4 py-2">{kegiatan.nama_kegiatan}</td>
                                                <td className="px-4 py-2"><Link href={route('proposal.show', kegiatan.proposal.id)} className="text-blue-600 hover:underline">Lihat</Link></td>
                                                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                                                <td className="px-4 py-2 text-center">{renderAksiButton(kegiatan)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={kegiatans.meta.links} className="mt-6"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal show={modalState.type === 'confirm'} onClose={closeModal}>
                <form onSubmit={handleConfirm} className="p-6"><h2 className="text-lg font-medium text-gray-900">Konfirmasi Kehadiran</h2><p className="mt-1 text-sm text-gray-600">Apakah Anda yakin ingin mengonfirmasi kehadiran untuk kegiatan "{modalState.kegiatan?.nama_kegiatan}"?</p><div className="mt-6 flex justify-end"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton className="ms-3" disabled={processingConfirm}>Ya, Konfirmasi</PrimaryButton></div></form>
            </Modal>
            <Modal show={modalState.type === 'docs'} onClose={closeModal}>
                <form onSubmit={handleDocsSubmit} className="p-6"><h2 className="text-lg font-medium text-gray-900">Dokumentasi Observasi</h2><p className="mt-1 text-sm text-gray-600">Isi detail observasi untuk kegiatan "{modalState.kegiatan?.nama_kegiatan}".</p><div className="mt-6"><InputLabel htmlFor="catatan_kebutuhan" value="Catatan Kebutuhan" /><TextAreaInput id="catatan_kebutuhan" className="mt-1 block w-full" value={docsData.catatan_kebutuhan} onChange={(e) => setDocsData('catatan_kebutuhan', e.target.value)} /><InputError message={docsErrors.catatan_kebutuhan} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="detail_pelaksanaan" value="Detail Pelaksanaan" /><TextAreaInput id="detail_pelaksanaan" className="mt-1 block w-full" value={docsData.detail_pelaksanaan} onChange={(e) => setDocsData('detail_pelaksanaan', e.target.value)} /><InputError message={docsErrors.detail_pelaksanaan} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="fotos" value="Unggah Foto Dokumentasi (Bisa lebih dari 1)" /><TextInput id="fotos" type="file" className="mt-1 block w-full" multiple onChange={(e) => setDocsData('fotos', e.target.files)} /><InputError message={docsErrors.fotos} className="mt-2" /></div><div className="mt-6 flex justify-end"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton className="ms-3" disabled={processingDocs}>Simpan Dokumentasi</PrimaryButton></div></form>
            </Modal>
            <Modal show={modalState.type === 'penyerahan'} onClose={closeModal}>
                <form onSubmit={handlePenyerahanSubmit} className="p-6"><h2 className="text-lg font-medium text-gray-900">Dokumentasi Penyerahan</h2><p className="mt-1 text-sm text-gray-600">Lengkapi data penyerahan untuk kegiatan "{modalState.kegiatan?.nama_kegiatan}".</p><div className="mt-6"><InputLabel htmlFor="nama_dokumentasi" value="Nama Dokumentasi" /><TextInput id="nama_dokumentasi" className="mt-1 block w-full" value={penyerahanData.nama_dokumentasi} onChange={(e) => setPenyerahanData('nama_dokumentasi', e.target.value)} required /><InputError message={penyerahanErrors.nama_dokumentasi} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="file_sktl_penyerahan" value="Unggah File SKTL Penyerahan" /><TextInput id="file_sktl_penyerahan" type="file" className="mt-1 block w-full" onChange={(e) => setPenyerahanData('file_sktl_penyerahan', e.target.files[0])} required /><InputError message={penyerahanErrors.file_sktl_penyerahan} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="file_kontrak" value="Unggah File Kontrak Pihak Ketiga (Jika ada)" /><TextInput id="file_kontrak" type="file" className="mt-1 block w-full" onChange={(e) => setPenyerahanData('file_kontrak', e.target.files[0])} /><InputError message={penyerahanErrors.file_kontrak} className="mt-2" /></div><div className="mt-6 flex justify-end"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton className="ms-3" disabled={processingPenyerahan}>Simpan Penyerahan</PrimaryButton></div></form>
            </Modal>
            <Modal show={modalState.type === 'penyelesaian'} onClose={closeModal}>
                <form onSubmit={handlePenyelesaianSubmit} className="p-6"><h2 className="text-lg font-medium text-gray-900">Penyelesaian Kegiatan</h2><p className="mt-1 text-sm text-gray-600">Lengkapi laporan akhir untuk kegiatan "{modalState.kegiatan?.nama_kegiatan}".</p><div className="mt-6"><InputLabel htmlFor="file_berita_acara" value="Unggah Berita Acara" /><TextInput id="file_berita_acara" type="file" className="mt-1 block w-full" onChange={(e) => setPenyelesaianData('file_berita_acara', e.target.files[0])} required /><InputError message={penyelesaianErrors.file_berita_acara} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="detail_akhir_kegiatan" value="Detail Akhir Kegiatan" /><TextAreaInput id="detail_akhir_kegiatan" className="mt-1 block w-full" value={penyelesaianData.detail_akhir_kegiatan} onChange={(e) => setPenyelesaianData('detail_akhir_kegiatan', e.target.value)} required /><InputError message={penyelesaianErrors.detail_akhir_kegiatan} className="mt-2" /></div><div className="mt-4"><InputLabel htmlFor="status_akhir" value="Status Akhir" /><SelectInput id="status_akhir" className="mt-1 block w-full" value={penyelesaianData.status_akhir} onChange={(e) => setPenyelesaianData('status_akhir', e.target.value)}><option>Selesai</option><option>Ditunda</option><option>Dibatalkan</option></SelectInput><InputError message={penyelesaianErrors.status_akhir} className="mt-2" /></div><div className="mt-6 flex justify-end"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton className="ms-3" disabled={processingPenyelesaian}>Selesaikan Kegiatan</PrimaryButton></div></form>
            </Modal>
        </PegawaiLayout>
    );
}
