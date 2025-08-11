// FUNGSI: Halaman utama untuk menampilkan daftar semua user/pegawai

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, users, success }) {
  // Fungsi untuk menghapus user
  const deleteUser = (user) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }
    router.delete(route('user.destroy', user.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div>
          <h2 className="font-semibold text-xl text-white leading-tight">
            Manajemen Pegawai
          </h2>
        </div>
      }
    >
      <Head title="Manajemen Pegawai" />

      <div className="py-6">
        <div className="max-w-full mx-auto">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
              {success}
            </div>
          )}
          
          {/* Header dengan Tombol Tambah Data dan Judul DATA PEGAWAI sejajar */}
          <div className="flex justify-between items-center mb-6">
            <Link
              href={route('user.create')}
              className="bg-[#394B7A] hover:bg-[#2d3a5f] text-white px-4 py-2 rounded inline-flex items-center font-medium transition-colors"
            >
              + Tambah Data
            </Link>
            <h3 className="text-xl font-bold text-gray-800 flex-1 text-center">DATA PEGAWAI</h3>
            <div className="w-[120px]"></div> {/* Spacer untuk balance */}
          </div>
          
          {/* Container dengan background putih dan shadow */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            
            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#394B7A] text-white">
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">NO</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nama Pegawai</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Email</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Nomor HP</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Role</th>
                    <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">Password</th>
                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.data && users.data.length > 0 ? (
                    users.data.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 border-r border-gray-200">{index + 1}</td>
                        <td className="px-6 py-4 border-r border-gray-200 font-medium">{user.name}</td>
                        <td className="px-6 py-4 border-r border-gray-200">{user.email}</td>
                        <td className="px-6 py-4 border-r border-gray-200">{user.no_hp || '-'}</td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <span className="capitalize">{user.role}</span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <span className="text-gray-400">••••••••</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              href={route('user.edit', user.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={(e) => deleteUser(user)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Empty rows untuk menunjukkan struktur tabel
                    Array.from({ length: 8 }, (_, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8 border-r border-gray-200"></td>
                        <td className="px-6 py-8">
                          <div className="flex justify-center space-x-2">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium">
                              Edit
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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