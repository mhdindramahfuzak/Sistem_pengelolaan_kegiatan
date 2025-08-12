// FUNGSI: Halaman utama untuk menampilkan daftar semua tim dan anggotanya.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, tims, success }) {
  // Fungsi untuk menghapus tim
  const deleteTim = (tim) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tim ini?')) {
      return;
    }
    router.delete(route('tim.destroy', tim.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div>
          <h2 className="font-semibold text-xl text-white leading-tight">
            Manajemen Tim
          </h2>
        </div>
      }
    >
      <Head title="Manajemen Tim" />

      <div className="py-6">
        <div className="max-w-full mx-auto">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
              {success}
            </div>
          )}
          
          {/* Header dengan Tombol dan Judul */}
          <div className="flex justify-between items-center mb-6">
            <Link
              href={route('tim.create')}
              className="bg-[#394B7A] hover:bg-[#2d3a5f] text-white px-4 py-2 rounded inline-flex items-center font-medium transition-colors"
            >
              + Tambah Tim Baru
            </Link>
            <h3 className="text-xl font-bold text-gray-800 flex-1 text-center">DATA TIM</h3>
            <div className="w-[140px]"></div>
          </div>
          
          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#394B7A] text-white">
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Tim</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Anggota Tim</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Tgl. Dibuat</th>
                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tims.data && tims.data.length > 0 ? (
                    tims.data.map((tim, index) => (
                      <tr
                        key={tim.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                        <td className="px-6 py-4 border-r border-gray-200 font-medium">{tim.nama_tim}</td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          {tim.users && tim.users.length > 0 
                            ? tim.users.map(user => user.name).join(', ')
                            : 'Tidak ada anggota'
                          }
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">{tim.created_at}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              href={route('tim.edit', tim.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteTim(tim)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // --- PERUBAHAN DI SINI ---
                    // Tampilkan pesan jika tidak ada data, alih-alih baris kosong.
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        Belum ada data tim.
                      </td>
                    </tr>
                    // --- AKHIR PERUBAHAN ---
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
