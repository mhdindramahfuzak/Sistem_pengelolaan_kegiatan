import NavLink from "@/Components/NavLink";

export default function SidebarPegawai() {
    return (
        <div className="flex flex-col space-y-2">
            {/* Tautan utama untuk Pegawai */}
            <NavLink 
                href={route('pegawai.kegiatan.myIndex')} 
                active={route().current('pegawai.kegiatan.myIndex')}
                className="w-full text-left"
            >
                Kegiatan Saya
            </NavLink>
            
            {/* Tambahkan menu lain di sini jika diperlukan di masa depan */}
            {/* Contoh:
            <NavLink href={route('arsip.index')} active={route().current('arsip.index')}>
                Arsip Kegiatan
            </NavLink>
            */}
        </div>
    );
}
