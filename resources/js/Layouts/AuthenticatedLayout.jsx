import { useState, cloneElement, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react'; // Diimpor usePage
import Dropdown from '@/Components/Dropdown';
import SidebarPegawai from '@/Layouts/Partials/SidebarPegawai';

// Komponen SidebarNavLink tidak perlu diubah
function SidebarNavLink({ href, active, children, as = 'a', method = 'get', isCollapsed, iconPath }) {
    const baseClasses = "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left";
    const activeClasses = "bg-[#192852] text-white shadow-lg";
    const inactiveClasses = "bg-[#EFF0F4] text-black hover:bg-gray-300";

    const props = {
        href,
        className: `${baseClasses} ${active ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`,
        title: isCollapsed ? children : ''
    };

    if (as === 'button') {
        props.method = method;
        props.as = as;
    }

    return (
        <Link {...props}>
            <div className="flex items-center min-w-0">
                <svg className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath || "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                {!isCollapsed && (
                    <span className="truncate">{children}</span>
                )}
            </div>
        </Link>
    );
}

// --- PERUBAHAN UTAMA DIMULAI DI SINI ---
export default function AuthenticatedLayout({ header, children }) { // Prop 'user' dihapus
    const { auth } = usePage().props; // Mengambil data 'auth' secara global
    const { user } = auth; // Mendapatkan 'user' dari 'auth'

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Fungsi ini sekarang aman karena 'user' dijamin ada dari usePage()
    const hasRole = (roleName) => user && user.roles && user.roles.some(role => role.name === roleName);

    const closeMobileSidebar = () => {
        if (isMobile) {
            setIsMobileSidebarOpen(false);
        }
    };
    
    const renderSidebarMenu = () => {
        if (hasRole('admin')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink href={route('user.index')} active={route().current('user.*')} isCollapsed={isSidebarCollapsed} iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                        Manajemen Pegawai
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('pengusul')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink href={route('proposal.myIndex')} active={route().current('proposal.myIndex')} isCollapsed={isSidebarCollapsed} iconPath="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z">
                        Proposal Saya
                    </SidebarNavLink>
                    <SidebarNavLink href={route('proposal.create')} active={route().current('proposal.create')} isCollapsed={isSidebarCollapsed} iconPath="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        Ajukan Proposal
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('kadis')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')} isCollapsed={isSidebarCollapsed} iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                        Dashboard
                    </SidebarNavLink>
                    <SidebarNavLink href={route('verifikasi.proposal.index')} active={route().current('verifikasi.proposal.*')} isCollapsed={isSidebarCollapsed} iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
                        Verifikasi Proposal
                    </SidebarNavLink>
                    <SidebarNavLink href={route('kabid.proposal.index')} active={route().current('kabid.proposal.*')} isCollapsed={isSidebarCollapsed} iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        Proposal Disetujui
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('kabid')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')} isCollapsed={isSidebarCollapsed} iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                        Dashboard
                    </SidebarNavLink>
                    <SidebarNavLink href={route('kabid.proposal.index')} active={route().current('kabid.proposal.*')} isCollapsed={isSidebarCollapsed} iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        Proposal Disetujui
                    </SidebarNavLink>
                    <SidebarNavLink href={route('kegiatan.index')} active={route().current('kegiatan.*')} isCollapsed={isSidebarCollapsed} iconPath="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                        Manajemen Kegiatan
                    </SidebarNavLink>
                    <SidebarNavLink href={route('manajemen.penyerahan.index')} active={route().current('manajemen.penyerahan.*')} isCollapsed={isSidebarCollapsed} iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                        Manajemen Penyerahan
                    </SidebarNavLink>
                    <SidebarNavLink href={route('tim.index')} active={route().current('tim.*')} isCollapsed={isSidebarCollapsed} iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                        Manajemen Tim
                    </SidebarNavLink>
                    {/* === MENU BARU UNTUK KABID === */}
                    <SidebarNavLink href={route('arsip.index')} active={route().current('arsip.*')} isCollapsed={isSidebarCollapsed} iconPath="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h12">
                        Arsip
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('pegawai')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')} isCollapsed={isSidebarCollapsed} iconPath="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                        Dashboard
                    </SidebarNavLink>
                    <SidebarPegawai isCollapsed={isSidebarCollapsed} />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {isMobile && isMobileSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileSidebar} />
            )}

            <aside className={`
                ${isMobile 
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
                    : 'relative'}
                ${isSidebarCollapsed && !isMobile ? 'w-20' : 'w-64'} 
                bg-white shadow-xl flex flex-col h-screen flex-shrink-0 transition-all duration-300`}>
                
                <div className="p-4 border-b relative">
                    <div className={`flex flex-col items-center w-full ${isSidebarCollapsed && !isMobile ? 'hidden' : ''}`}>
                        <img src="/images/logo-sumut.jpg" alt="Logo DISKP Sumut" className="h-16 w-auto mb-2" />
                        <h1 className="text-lg font-bold text-gray-800 capitalize text-center">
                            {user.roles.length > 0 ? user.roles[0].name : 'Pengguna'}
                        </h1>
                    </div>
                    {isSidebarCollapsed && !isMobile && (
                        <div className="flex justify-center w-full">
                            <img src="/images/logo-sumut.jpg" alt="Logo" className="h-8 w-auto" />
                        </div>
                    )}
                    {!isMobile && (
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors absolute top-4 right-4" title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {renderSidebarMenu()}
                    
                    <SidebarNavLink href={route('profile.edit')} active={route().current('profile.edit')} isCollapsed={isSidebarCollapsed} iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                        Akun
                    </SidebarNavLink>
                </nav>

                <div className="p-4 border-t">
                    <SidebarNavLink href={route('logout')} method="post" as="button" active={false} isCollapsed={isSidebarCollapsed} iconPath="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                        Log Out
                    </SidebarNavLink>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="shadow-sm" style={{ backgroundColor: '#25335C' }}>
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                            {isMobile && (
                                <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                            )}
                            {header && cloneElement(header, { className: `${(header.props.className || '').replace(/text-gray-\d+|text-black/g, '')} text-white` })}
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-transparent hover:text-gray-200 focus:outline-none transition ease-in-out duration-150">
                                                {user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}