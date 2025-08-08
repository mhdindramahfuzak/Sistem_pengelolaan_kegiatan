import { Link } from '@inertiajs/react';

// Komponen link navigasi dengan gaya khusus untuk sidebar
function SidebarNavLink({ href, active, children }) {
    const baseClasses = "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left";
    const activeClasses = "bg-[#192852] text-white shadow-lg"; // Gaya saat aktif
    const inactiveClasses = "bg-[#EFF0F4] text-black hover:bg-gray-300"; // Gaya saat tidak aktif

    return (
        <Link href={href} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </Link>
    );
}

export default function SidebarPegawai() {
    return (
        <>
            <SidebarNavLink 
                href={route('pegawai.kegiatan.myIndex')} 
                active={route().current('pegawai.kegiatan.*')}
            >
                Kegiatan Saya
            </SidebarNavLink>
            {/* Jika ada menu pegawai lainnya di masa depan, tambahkan di sini */}
        </>
    );
}
