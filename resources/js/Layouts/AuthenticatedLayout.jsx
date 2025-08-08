import { useState, cloneElement } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import SidebarPegawai from '@/Layouts/Partials/SidebarPegawai';

// Komponen link navigasi dengan gaya khusus untuk sidebar
function SidebarNavLink({ href, active, children, as = 'a', method = 'get' }) {
    const baseClasses = "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out text-left";
    const activeClasses = "bg-[#192852] text-white shadow-lg";
    const inactiveClasses = "bg-[#EFF0F4] text-black hover:bg-gray-300";

    const props = {
        href,
        className: `${baseClasses} ${active ? activeClasses : inactiveClasses}`,
    };

    if (as === 'button') {
        props.method = method;
        props.as = as;
    }

    return <Link {...props}>{children}</Link>;
}

export default function AuthenticatedLayout({ user, header, children }) {
    const hasRole = (roleName) => user.roles.some(role => role.name === roleName);

    // Fungsi untuk menampilkan menu sidebar berdasarkan peran (role) pengguna
    const renderSidebarMenu = () => {
        if (hasRole('admin')) {
            return (
                <SidebarNavLink href={route('user.index')} active={route().current('user.*')}>
                    Manajemen Pegawai
                </SidebarNavLink>
            );
        }

        if (hasRole('pengusul')) {
            return (
                <>
                    <SidebarNavLink href={route('proposal.myIndex')} active={route().current('proposal.myIndex')}>
                        Proposal Saya
                    </SidebarNavLink>
                    <SidebarNavLink href={route('proposal.create')} active={route().current('proposal.create')}>
                        Ajukan Proposal
                    </SidebarNavLink>
                </>
            );
        }

        if (hasRole('kadis')) {
            return (
                <>
                    <SidebarNavLink href={route('verifikasi.proposal.index')} active={route().current('verifikasi.proposal.*')}>
                        Verifikasi Proposal
                    </SidebarNavLink>
                    <SidebarNavLink href={route('kabid.proposal.index')} active={route().current('kabid.proposal.*')}>
                        Proposal Disetujui
                    </SidebarNavLink>
                </>
            );
        }

        if (hasRole('kabid')) {
            return (
                <>
                    <SidebarNavLink href={route('kabid.proposal.index')} active={route().current('kabid.proposal.*')}>
                        Proposal Disetujui
                    </SidebarNavLink>
                    <SidebarNavLink href={route('kegiatan.index')} active={route().current('kegiatan.*')}>
                        Manajemen Kegiatan
                    </SidebarNavLink>
                    <SidebarNavLink href={route('manajemen.penyerahan.index')} active={route().current('manajemen.penyerahan.*')}>
                        Manajemen Penyerahan
                    </SidebarNavLink>
                    <SidebarNavLink href={route('tim.index')} active={route().current('tim.*')}>
                        Manajemen Tim
                    </SidebarNavLink>
                </>
            );
        }

        if (hasRole('pegawai')) {
            return <SidebarPegawai />;
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white shadow-xl p-6 flex flex-col h-screen flex-shrink-0">
                <div className="flex flex-col items-center justify-center mb-8">
                    <img src="/images/logo-sumut.jpg" alt="Logo DISKP Sumut" className="h-20 w-auto mb-2" />
                    <h1 className="text-xl font-bold text-gray-800 capitalize">
                        {user.roles.length > 0 ? user.roles[0].name : 'Pengguna'}
                    </h1>
                </div>

                <nav className="flex flex-col space-y-3">
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Dashboard
                    </SidebarNavLink>
                    
                    {renderSidebarMenu()}

                    <SidebarNavLink href={route('arsip.index')} active={route().current('arsip.*')}>
                        Arsip
                    </SidebarNavLink>
                </nav>

                <div className="mt-auto">
                    <SidebarNavLink href={route('logout')} method="post" as="button" active={false}>
                        Log Out
                    </SidebarNavLink>
                </div>
            </aside>

            {/* --- KONTEN UTAMA --- */}
            <div className="flex-1 flex flex-col">
                <header className="shadow-sm" style={{ backgroundColor: '#25335C' }}>
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div>
                            {/* PERBAIKAN UTAMA: Mengganti class warna teks pada elemen header */}
                            {header && cloneElement(header, {
                                className: `${(header.props.className || '').replace(/text-gray-\d+|text-black/g, '')} text-white`
                            })}
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
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

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
