import { useState, cloneElement, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import SidebarPegawai from '@/Layouts/Partials/SidebarPegawai';

// Komponen SidebarNavLink tidak perlu diubah, biarkan seperti aslinya.
function SidebarNavLink({ href, active, children, as = 'a', method = 'get', isCollapsed }) {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {!isCollapsed && (
                    <span className="truncate">{children}</span>
                )}
            </div>
        </Link>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const hasRole = (roleName) => user.roles.some(role => role.name === roleName);

    const closeMobileSidebar = () => {
        if (isMobile) {
            setIsMobileSidebarOpen(false);
        }
    };

    const renderSidebarMenu = () => {
        if (hasRole('admin')) {
            return (
                <SidebarNavLink 
                    href={route('user.index')} 
                    active={route().current('user.*')}
                    isCollapsed={isSidebarCollapsed}
                >
                    Manajemen Pegawai
                </SidebarNavLink>
            );
        }
        if (hasRole('pengusul')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink 
                        href={route('proposal.myIndex')} 
                        active={route().current('proposal.myIndex')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Proposal Saya
                    </SidebarNavLink>
                    <SidebarNavLink 
                        href={route('proposal.create')} 
                        active={route().current('proposal.create')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Ajukan Proposal
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('kadis')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink 
                        href={route('verifikasi.proposal.index')} 
                        active={route().current('verifikasi.proposal.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Verifikasi Proposal
                    </SidebarNavLink>
                    <SidebarNavLink 
                        href={route('kabid.proposal.index')} 
                        active={route().current('kabid.proposal.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Proposal Disetujui
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('kabid')) {
            return (
                <div className="space-y-2">
                    <SidebarNavLink 
                        href={route('kabid.proposal.index')} 
                        active={route().current('kabid.proposal.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Proposal Disetujui
                    </SidebarNavLink>
                    <SidebarNavLink 
                        href={route('kegiatan.index')} 
                        active={route().current('kegiatan.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Manajemen Kegiatan
                    </SidebarNavLink>
                    <SidebarNavLink 
                        href={route('manajemen.penyerahan.index')} 
                        active={route().current('manajemen.penyerahan.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Manajemen Penyerahan
                    </SidebarNavLink>
                    <SidebarNavLink 
                        href={route('tim.index')} 
                        active={route().current('tim.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Manajemen Tim
                    </SidebarNavLink>
                </div>
            );
        }
        if (hasRole('pegawai')) {
            return <SidebarPegawai isCollapsed={isSidebarCollapsed} />;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {isMobile && isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* --- SIDEBAR --- */}
            {/* PERUBAHAN UTAMA ADA DI DALAM <aside> INI */}
            <aside className={`
                ${isMobile 
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
                        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }` 
                    : 'relative'
                }
                ${isSidebarCollapsed && !isMobile ? 'w-16' : 'w-64'} 
                bg-white shadow-xl flex flex-col h-screen flex-shrink-0 transition-all duration-300
            `}>
                {/* Bagian Header Sidebar */}
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className={`flex flex-col items-center ${isSidebarCollapsed && !isMobile ? 'hidden' : ''}`}>
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
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d={isSidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M5 12h14"} />
                                </svg>
                            </button>
                        )}
                        
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Bagian Navigasi Utama (Dibuat agar bisa tumbuh mengisi ruang) */}
                <nav className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">
                    <SidebarNavLink 
                        href={route('dashboard')} 
                        active={route().current('dashboard')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Dashboard
                    </SidebarNavLink>
                    
                    {renderSidebarMenu()}

                    <SidebarNavLink 
                        href={route('arsip.index')} 
                        active={route().current('arsip.*')}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Arsip
                    </SidebarNavLink>
                </nav>

                {/* Bagian Bawah (Footer) Sidebar untuk Logout */}
                <div className="p-6">
                    <SidebarNavLink 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        active={false}
                        isCollapsed={isSidebarCollapsed}
                    >
                        Log Out
                    </SidebarNavLink>
                </div>
            </aside>

            {/* --- KONTEN UTAMA --- */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="shadow-sm" style={{ backgroundColor: '#25335C' }}>
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                            {isMobile && (
                                <button
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors mr-4"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                            
                            {header && cloneElement(header, {
                                className: `${(header.props.className || '').replace(/text-gray-\d+|text-black/g, '')} text-white`
                            })}
                        </div>
                        
                        <div className="flex items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-transparent hover:text-gray-200 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}