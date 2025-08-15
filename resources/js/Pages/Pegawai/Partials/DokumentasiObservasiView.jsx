import React, { useState, useEffect } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextAreaInput from '@/Components/TextAreaInput';
import Dialog from '@/Components/Dialog';
import SecondaryButton from '@/Components/SecondaryButton';

// --- KOMPONEN BARU UNTUK INPUT KEBUTUHAN ---
const KebutuhanRow = ({ kegiatan }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_kebutuhan: '',
        jumlah: '',
        satuan: '',
        harga_satuan: '',
    });

    // Cek apakah kegiatan ini sudah memiliki kebutuhan - TIDAK perlu dokumentasi observasi
    const hasKebutuhan = kegiatan.kebutuhans && kegiatan.kebutuhans.length > 0;

    // Debug logging
    console.log('Kegiatan ID:', kegiatan.id);
    console.log('Kegiatan kebutuhans:', kegiatan.kebutuhans);
    console.log('hasKebutuhan:', hasKebutuhan);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleKebutuhanSubmit = (e) => {
        e.preventDefault();
        post(route('pegawai.kegiatan.storeKebutuhan', kegiatan.id), {
            onSuccess: () => {
                closeModal();
                Swal.fire('Berhasil!', 'Data kebutuhan berhasil disimpan.', 'success').then(() => {
                    // Refresh halaman setelah user menutup alert
                    window.location.reload();
                });
            },
            onError: (err) => {
                const errorMessages = Object.values(err).join('<br/>');
                Swal.fire('Gagal Menyimpan!', `Terjadi kesalahan:<br/><br/>${errorMessages}`, 'error');
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            {/* Tombol Input/Lihat Kebutuhan */}
            {hasKebutuhan ? (
                <Link 
                    href={route('pegawai.kegiatan.showKebutuhan', kegiatan.id)} 
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Lihat Kebutuhan
                </Link>
            ) : (
                <button
                    onClick={openModal}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Input Kebutuhan
                </button>
            )}

            {/* Modal/Dialog untuk Form Input Kebutuhan */}
            <Dialog show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Input Kebutuhan - {kegiatan.nama_kegiatan}
                    </h2>
                    <form onSubmit={handleKebutuhanSubmit} className="space-y-4">
                        <div>
                            <label htmlFor={`nama_kebutuhan_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Kebutuhan <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                id={`nama_kebutuhan_${kegiatan.id}`}
                                name="nama_kebutuhan"
                                className="w-full"
                                value={data.nama_kebutuhan}
                                onChange={(e) => setData('nama_kebutuhan', e.target.value)}
                                placeholder="Contoh: Alat Tulis, Konsumsi, dll"
                                required
                            />
                            <InputError message={errors.nama_kebutuhan} className="mt-1" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={`jumlah_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah <span className="text-red-500">*</span>
                                </label>
                                <TextInput
                                    id={`jumlah_${kegiatan.id}`}
                                    name="jumlah"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    className="w-full"
                                    value={data.jumlah}
                                    onChange={(e) => setData('jumlah', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <InputError message={errors.jumlah} className="mt-1" />
                            </div>
                            
                            <div>
                                <label htmlFor={`satuan_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Satuan <span className="text-red-500">*</span>
                                </label>
                                <TextInput
                                    id={`satuan_${kegiatan.id}`}
                                    name="satuan"
                                    className="w-full"
                                    value={data.satuan}
                                    onChange={(e) => setData('satuan', e.target.value)}
                                    placeholder="pcs, kg, liter, dll"
                                    required
                                />
                                <InputError message={errors.satuan} className="mt-1" />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor={`harga_satuan_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Harga Satuan (Rp) <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                id={`harga_satuan_${kegiatan.id}`}
                                name="harga_satuan"
                                type="number"
                                min="0"
                                step="100"
                                className="w-full"
                                value={data.harga_satuan}
                                onChange={(e) => setData('harga_satuan', e.target.value)}
                                placeholder="0"
                                required
                            />
                            <InputError message={errors.harga_satuan} className="mt-1" />
                        </div>
                        
                        {/* Menampilkan Total Harga */}
                        {data.jumlah && data.harga_satuan && (
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">
                                    Total Estimasi: <span className="font-semibold text-gray-900">
                                        Rp {(parseFloat(data.jumlah || 0) * parseFloat(data.harga_satuan || 0)).toLocaleString('id-ID')}
                                    </span>
                                </p>
                            </div>
                        )}
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>
                                Batal
                            </SecondaryButton>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#394B7A] hover:bg-[#2d3a5f] text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Kebutuhan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    );
};

const FormRow = ({ kegiatan, index }) => {
    const [showModal, setShowModal] = useState(false);
    
    // Form untuk dokumentasi observasi
    const { data, setData, post, processing, errors, reset } = useForm({
        kegiatan_id: kegiatan.id,
        nama_dokumentasi: '',
        deskripsi: `Dokumentasi observasi kegiatan ${kegiatan.nama_kegiatan} pada tanggal ${kegiatan.tanggal_kegiatan}. Kegiatan berjalan sesuai rencana dan telah dilaksanakan dengan baik.`, // Auto-fill dengan catatan default
        fotos: [],
    });

    // Cek apakah sudah ada dokumentasi observasi dan kebutuhan
    const dokObservasi = (kegiatan.dokumentasi ?? []).find(d => d.tipe === 'observasi');
    const hasKebutuhan = kegiatan.kebutuhans && kegiatan.kebutuhans.length > 0;
    const isCompleted = dokObservasi && hasKebutuhan;

    // Set data form ketika modal dibuka dan ada dokumentasi existing
    useEffect(() => {
        if (showModal && dokObservasi) {
            setData({
                kegiatan_id: kegiatan.id,
                nama_dokumentasi: dokObservasi.nama_dokumentasi || '',
                deskripsi: dokObservasi.deskripsi || `Dokumentasi observasi kegiatan ${kegiatan.nama_kegiatan} pada tanggal ${kegiatan.tanggal_kegiatan}. Kegiatan berjalan sesuai rencana dan telah dilaksanakan dengan baik.`,
                fotos: [], // Reset fotos karena tidak bisa di-set untuk input file
            });
        } else if (!showModal) {
            // Reset form ketika modal ditutup dengan catatan default
            reset();
            setData(prev => ({
                ...prev,
                deskripsi: `Dokumentasi observasi kegiatan ${kegiatan.nama_kegiatan} pada tanggal ${kegiatan.tanggal_kegiatan}. Kegiatan berjalan sesuai rencana dan telah dilaksanakan dengan baik.`
            }));
        }
    }, [showModal, dokObservasi]);

    const handleKonfirmasi = (kegiatanId) => {
        // HAPUS KONDISI VALIDASI - tombol selalu bisa diklik
        Swal.fire({
            title: 'Lanjut ke Tahap Berikutnya',
            text: 'Apakah Anda yakin ingin melanjutkan kegiatan ini ke tahap berikutnya?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#394B7A',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('pegawai.kegiatan.lanjutTahapBerikutnya', kegiatanId), {}, {
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Kegiatan telah dilanjutkan ke tahap berikutnya.', 'success').then(() => {
                            // Refresh halaman setelah user menutup alert
                            window.location.reload();
                        });
                    },
                    onError: (error) => {
                        const errorMessages = Object.values(error).join('\n');
                        Swal.fire('Gagal!', `Terjadi kesalahan: ${errorMessages}`, 'error');
                    }
                });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Tentukan apakah ini update atau create
        const routeName = dokObservasi 
            ? 'pegawai.kegiatan.updateObservasi' 
            : 'pegawai.kegiatan.storeObservasi';
            
        post(route(routeName, kegiatan.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: dokObservasi ? 'Berhasil Diupdate!' : 'Berhasil Disimpan!',
                    text: dokObservasi 
                        ? 'Dokumentasi observasi telah diupdate.' 
                        : 'Dokumentasi observasi telah tersimpan. Silakan lanjutkan dengan input kebutuhan jika diperlukan.',
                }).then(() => {
                    // Refresh halaman setelah user menutup alert
                    window.location.reload();
                });
            },
            onError: (error) => {
                const errorMessages = Object.values(error).join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Pastikan semua data sudah terisi dengan benar. \n\n ${errorMessages}`,
                });
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    return (
        <>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                <td className="px-6 py-4 border-r border-gray-200 font-medium">{kegiatan.nama_kegiatan}</td>
                <td className="px-6 py-4 border-r border-gray-200">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-6 py-4 border-r border-gray-200">
                    {isCompleted ? (
                        <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Sudah Lengkap
                        </span>
                    ) : (dokObservasi || hasKebutuhan) ? (
                        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                            Sebagian Lengkap
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                            Sedang Dokumentasi Observasi
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                    <button
                        onClick={() => setShowModal(true)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            dokObservasi
                                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {dokObservasi ? 'Edit Dokumentasi' : 'Isi Dokumentasi'}
                    </button>
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                    <KebutuhanRow kegiatan={kegiatan} />
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        <button
                            onClick={() => handleKonfirmasi(kegiatan.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                            Lanjut ke Tahap Berikutnya
                        </button>
                    </div>
                </td>
            </tr>

            {/* Modal untuk Dokumentasi Observasi */}
            <Dialog show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {dokObservasi ? 'Edit Dokumentasi Observasi' : 'Isi Dokumentasi Observasi'} - {kegiatan.nama_kegiatan}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor={`nama_dokumentasi_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Dokumentasi <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                id={`nama_dokumentasi_${kegiatan.id}`}
                                name="nama_dokumentasi"
                                className="w-full"
                                value={data.nama_dokumentasi}
                                onChange={(e) => setData('nama_dokumentasi', e.target.value)}
                                required
                            />
                            <InputError message={errors.nama_dokumentasi} className="mt-1" />
                        </div>
                        
                        {/* HIDDEN INPUT untuk deskripsi - tidak ditampilkan ke user */}
                        <input
                            type="hidden"
                            name="deskripsi"
                            value={data.deskripsi}
                        />
                        
                        <div>
                            <label htmlFor={`fotos_${kegiatan.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Unggah Foto Bukti {dokObservasi ? '(Kosongkan jika tidak ingin mengubah foto)' : '(Opsional)'}
                            </label>
                            <input
                                id={`fotos_${kegiatan.id}`}
                                type="file"
                                name="fotos"
                                multiple
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setData('fotos', Array.from(e.target.files))}
                            />
                            <InputError message={errors.fotos} className="mt-1" />
                            {dokObservasi && dokObservasi.fotos && dokObservasi.fotos.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Foto saat ini: {dokObservasi.fotos.length} file
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <SecondaryButton type="button" onClick={closeModal}>
                                Batal
                            </SecondaryButton>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#394B7A] hover:bg-[#2d3a5f] text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : (dokObservasi ? 'Update Dokumentasi' : 'Simpan Dokumentasi')}
                            </button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    );
};

export default function DokumentasiObservasiView({ kegiatans }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#394B7A] text-white">
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                NO
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Nama Kegiatan
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Tanggal
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Isi Dokumentasi
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Kebutuhan
                            </th>
                            <th className="px-6 py-4 text-center font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kegiatans.data && kegiatans.data.length > 0 ? (
                            kegiatans.data.map((kegiatan, index) => {
                                return <FormRow key={kegiatan.id} kegiatan={kegiatan} index={index} />;
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-medium">
                                    Tidak ada kegiatan yang sedang menunggu proses
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}