// FUNGSI: Halaman untuk menampilkan formulir tambah tim baru dengan desain yang lebih menarik
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { useState } from 'react';

export default function Create({ auth, pegawais }) {
  const { data, setData, post, errors, processing } = useForm({
    nama_tim: '',
    user_ids: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter pegawai berdasarkan search term
  const filteredPegawais = pegawais.data.filter(pegawai =>
    pegawai.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pegawai.email && pegawai.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fungsi untuk menangani perubahan pada checkbox anggota
  const handleMemberChange = (e) => {
    const userId = parseInt(e.target.value);
    let newUserIds = [...data.user_ids];

    if (e.target.checked) {
      newUserIds.push(userId);
    } else {
      newUserIds = newUserIds.filter(id => id !== userId);
    }
    setData('user_ids', newUserIds);
  };

  // Fungsi untuk select/unselect semua anggota (filtered)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filteredPegawais.map(pegawai => pegawai.id);
      const newUserIds = [...new Set([...data.user_ids, ...allFilteredIds])];
      setData('user_ids', newUserIds);
    } else {
      const filteredIds = filteredPegawais.map(p => p.id);
      const newUserIds = data.user_ids.filter(id => !filteredIds.includes(id));
      setData('user_ids', newUserIds);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('tim.store'), {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    });
  };

  // Cek status selection untuk filtered results
  const selectedFromFiltered = filteredPegawais.filter(p => data.user_ids.includes(p.id)).length;
  const isAllFilteredSelected = filteredPegawais.length > 0 && selectedFromFiltered === filteredPegawais.length;
  const isSomeFilteredSelected = selectedFromFiltered > 0 && selectedFromFiltered < filteredPegawais.length;

  // Generate random avatar colors
  const getAvatarColor = (id) => {
    const colors = [
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ];
    return colors[id % colors.length];
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Buat Tim Baru
        </h2>
      }
    >
      <Head title="Tambah Tim" />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Tim berhasil dibuat!</span>
          </div>
        </div>
      )}
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border-0">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Informasi Tim</h3>
                  <p className="text-sm text-gray-600 mt-1">Isi detail tim dan pilih anggota yang akan bergabung</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{data.user_ids.length}</div>
                  <div className="text-xs text-gray-500">Anggota Terpilih</div>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-8">
              
              {/* Nama Tim Section */}
              <div className="mb-6">
                <InputLabel htmlFor="nama_tim" value="Nama Tim" className="text-gray-700 font-medium" />
                
                <TextInput 
                  id="nama_tim" 
                  type="text" 
                  name="nama_tim" 
                  value={data.nama_tim} 
                  className="mt-2 block w-full border-gray-300 rounded-md focus:border-emerald-500 focus:ring-emerald-500" 
                  isFocused={true} 
                  onChange={(e) => setData('nama_tim', e.target.value)}
                  placeholder="Contoh: Tim Pengembangan Web"
                />
                <InputError message={errors.nama_tim} className="mt-2" />
              </div>

              {/* Anggota Tim Section */}
              <div>
                <InputLabel value="Pilih Anggota Tim" className="text-gray-700 font-medium" />

                {/* Search Box */}
                <div className="relative mt-2 mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari pegawai..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-emerald-500 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Info dan Select All */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                  <span>{selectedFromFiltered} dari {filteredPegawais.length} pegawai dipilih</span>
                  
                  {filteredPegawais.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select_all"
                        checked={isAllFilteredSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isSomeFilteredSelected;
                        }}
                        onChange={handleSelectAll}
                      />
                      <label htmlFor="select_all" className="text-sm text-gray-700 cursor-pointer">
                        Pilih Semua
                      </label>
                    </div>
                  )}
                </div>

                {/* Daftar Pegawai - Sederhana */}
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredPegawais.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {filteredPegawais.map((pegawai) => (
                          <div 
                            key={pegawai.id} 
                            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                              data.user_ids.includes(pegawai.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            {/* Avatar Sederhana */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 ${getAvatarColor(pegawai.id)}`}>
                              {pegawai.name.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <label 
                                htmlFor={`pegawai_${pegawai.id}`} 
                                className="cursor-pointer block"
                              >
                                <div className="font-medium text-gray-900">
                                  {pegawai.name}
                                </div>
                                {pegawai.email && (
                                  <div className="text-sm text-gray-500 truncate">
                                    {pegawai.email}
                                  </div>
                                )}
                              </label>
                            </div>
                            
                            {/* Checkbox */}
                            <div className="flex-shrink-0">
                              <Checkbox
                                id={`pegawai_${pegawai.id}`}
                                value={pegawai.id}
                                onChange={handleMemberChange}
                                checked={data.user_ids.includes(pegawai.id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500">
                          {searchTerm ? 'Tidak ada pegawai yang cocok dengan pencarian' : 'Tidak ada pegawai tersedia'}
                        </div>
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
                          >
                            Hapus filter pencarian
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <InputError message={errors.user_ids} className="mt-2" />
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link 
                  href={route('tim.index')} 
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Batal
                </Link>
                
                <button 
                  type="submit"
                  disabled={processing || !data.nama_tim.trim() || data.user_ids.length === 0} 
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 font-semibold"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Buat Tim
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}