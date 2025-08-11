import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Pagination from "@/Components/Pagination";

export default function Index({ auth, kegiatans, success }) {
  // Gunakan useEffect untuk memantau prop 'success'
  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: success,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [success]);

  const deleteKegiatan = (kegiatan) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Menghapus kegiatan "${kegiatan.nama_kegiatan}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('kegiatan.destroy', kegiatan.id));
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div>
          <h2 className="font-semibold text-xl text-white leading-tight">
            Manajemen Kegiatan
          </h2>
        </div>
      }
    >
      <Head title="Manajemen Kegiatan" />

      <div className="py-6">
        <div className="max-w-full mx-auto">
          
          {/* Header dengan Tombol Tambah Data dan Judul sejajar */}
          <div className="flex justify-between items-center mb-6">
            <Link
              href={route('kegiatan.create')}
              className="bg-[#394B7A] hover:bg-[#2d3a5f] text-white px-4 py-2 rounded inline-flex items-center font-medium transition-colors"
            >
              + Tambah Kegiatan Baru
            </Link>
            <h3 className="text-xl font-bold text-gray-800 flex-1 text-center">DATA KEGIATAN</h3>
            <div className="w-[180px]"></div> {/* Spacer untuk balance */}
          </div>
          
          {/* Container dengan background putih dan shadow */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            
            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#394B7A] text-white">
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Kegiatan</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Proposal Terkait</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tim</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tgl Kegiatan</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Dibuat Oleh</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">SKTL</th>
                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* --- PERBAIKAN UTAMA --- */}
                  {/* Cek jika `kegiatans.data` ada dan memiliki isi */}
                  {kegiatans && kegiatans.data && kegiatans.data.length > 0 ? (
                    kegiatans.data.map((kegiatan, index) => (
                      <tr
                        key={kegiatan.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 border-r border-gray-200">
                          {/* PERBAIKAN: Hitung nomor urut dengan aman.
                            Cek dulu apakah `kegiatans.meta` ada sebelum mengakses propertinya.
                            Jika tidak ada, gunakan `index + 1` sebagai fallback.
                          */}
                          {kegiatans.meta
                            ? ((kegiatans.meta.current_page - 1) * kegiatans.meta.per_page) + index + 1
                            : index + 1}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200 font-medium">
                          {kegiatan.nama_kegiatan}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {kegiatan.proposal?.nama_proposal || '-'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {kegiatan.tim?.nama_tim || 'Belum Ditentukan'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {kegiatan.tanggal_kegiatan}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {kegiatan.createdBy?.name || 'kabid'}
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {kegiatan.sktl_path ? (
                            <a 
                              href={kegiatan.sktl_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors inline-block"
                            >
                              Lihat SKTL
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">Tidak Ada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              href={route('kegiatan.edit', kegiatan.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteKegiatan(kegiatan)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Tampilan jika tidak ada data sama sekali
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                        Tidak ada data kegiatan yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {/* Cek paginasi juga dibuat lebih aman */}
          {kegiatans && kegiatans.meta && kegiatans.meta.links && kegiatans.data.length > 0 && (
            <div className="mt-6">
              <Pagination links={kegiatans.meta.links} />
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
