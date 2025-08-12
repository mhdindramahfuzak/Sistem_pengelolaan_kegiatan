import { Link } from '@inertiajs/react';

export default function PerjalananDinasView({ kegiatans, openModal }) {
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
                                SKTL
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Tanggal
                            </th>
                            <th className="px-6 py-4 text-center font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kegiatans.data && kegiatans.data.length > 0 ? (
                            kegiatans.data.map((kegiatan, index) => (
                                <tr
                                    key={kegiatan.id}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 border-r border-gray-200 font-medium">
                                        {kegiatan.nama_kegiatan}
                                    </td>
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        {/* PERBAIKAN: Cek jika sktl_url ada */}
                                        {kegiatan.sktl_url ? (
                                            <a 
                                                href={kegiatan.sktl_url} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Lihat File
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Tidak ada file</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        {kegiatan.tanggal_kegiatan}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => openModal('confirm', kegiatan)} 
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Hadir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">
                                    Tidak ada kegiatan perjalanan dinas yang perlu dikonfirmasi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
