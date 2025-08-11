import { Link } from '@inertiajs/react';
import { useState } from 'react';

// Komponen link navigasi dengan gaya khusus untuk sidebar
function SidebarNavLink({ href, active, children, isCollapsed = false }) {
    const baseClasses = "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left";
    const activeClasses = "bg-[#192852] text-white shadow-lg";
    const inactiveClasses = "bg-[#EFF0F4] text-black hover:bg-gray-300";

    return (
        <Link 
            href={href} 
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? children : ''}
        >
            <div className="flex items-center min-w-0">
                {/* Icon untuk menu kegiatan */}
                <svg className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {!isCollapsed && (
                    <span className="truncate">{children}</span>
                )}
            </div>
        </Link>
    );
}

// Komponen Dropdown untuk menu yang bisa expand/collapse
function SidebarDropdown({ title, children, isCollapsed }) {
    const [isOpen, setIsOpen] = useState(false);

    if (isCollapsed) {
        return (
            <div className="relative group">
                <button
                    className="flex items-center justify-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left bg-[#EFF0F4] text-black hover:bg-gray-300"
                    title={title}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </button>
                {/* Tooltip untuk collapsed state */}
                <div className="absolute left-full ml-2 top-0 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {title}
                </div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left bg-[#EFF0F4] text-black hover:bg-gray-300"
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="truncate">{title}</span>
                </div>
                <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <div className="ml-4 space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function SidebarPegawai({ isCollapsed = false }) {
    return (
        <div className="space-y-2">
            {/* Menu utama - Kegiatan Saya */}
            <SidebarNavLink 
                href={route('pegawai.kegiatan.myIndex')} 
                active={route().current('pegawai.kegiatan.*')}
                isCollapsed={isCollapsed}
            >
                Kegiatan Saya
            </SidebarNavLink>

            {/* Dropdown untuk Laporan (contoh untuk ekspansi di masa depan) */}
            <SidebarDropdown 
                title="Laporan Kegiatan" 
                isCollapsed={isCollapsed}
            >
                <SidebarNavLink 
                    href="#" 
                    active={false}
                    isCollapsed={false}
                >
                    Laporan Harian
                </SidebarNavLink>
                <SidebarNavLink 
                    href="#" 
                    active={false}
                    isCollapsed={false}
                >
                    Laporan Bulanan
                </SidebarNavLink>
            </SidebarDropdown>

            {/* Menu tambahan untuk ekspansi di masa depan */}
            <SidebarNavLink 
                href="#" 
                active={false}
                isCollapsed={isCollapsed}
            >
                Jadwal Kerja
            </SidebarNavLink>
        </div>
    );
}