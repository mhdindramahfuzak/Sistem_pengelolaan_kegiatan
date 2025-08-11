import { Link } from '@inertiajs/react';

export default function MenungguProsesKabidView({ kegiatans }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#394B7A] text-white">
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Nama Kegiatan
                            </th>
                            <th className="px-6 py-4 text-left font-semibold border-r border-[#4A5B8F]">
                                Status Proses
                            </th>
                            <th className="px-6 py-4 text-center font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {kegiatans.data.length > 0 ? (
                            kegiatans.data.map((kegiatan) => (
                                <tr 
                                    key={kegiatan.id} 
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 border-r border-gray-200 font-medium">
                                        {kegiatan.nama_kegiatan}
                                    </td>
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                                            Sedang Diproses oleh Kabid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Link 
                                                href={route('arsip.show', kegiatan.id)} 
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 font-medium">
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