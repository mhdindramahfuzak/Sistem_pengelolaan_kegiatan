import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Landing() {
    // State untuk mobile menu dan scroll effect
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Daftar foto yang akan ditampilkan (1-8)
    const galleryImages = [
        {
            url: '/images/gallery/foto1.jpeg',
            title: 'Penyerahan Bantuan Perahu Nelayan',
            description: 'Program bantuan perahu untuk meningkatkan produktivitas nelayan di wilayah pesisir Sumatera Utara.'
        },
        {
            url: '/images/gallery/foto2.jpeg',
            title: 'Pelatihan Teknologi Penangkapan Ikan',
            description: 'Sosialisasi dan pelatihan penggunaan teknologi modern dalam penangkapan ikan yang ramah lingkungan.'
        },
        {
            url: '/images/gallery/foto3.jpeg',
            title: 'Monitoring Hasil Tangkapan',
            description: 'Kegiatan monitoring dan evaluasi hasil tangkapan nelayan untuk data statistik perikanan.'
        },
        {
            url: '/images/gallery/foto4.jpeg',
            title: 'Bantuan Alat Penangkapan Ikan',
            description: 'Distribusi alat penangkapan ikan modern kepada kelompok nelayan di berbagai daerah.'
        },
        {
            url: '/images/gallery/foto5.jpeg',
            title: 'Pemberdayaan Masyarakat Pesisir',
            description: 'Program pemberdayaan ekonomi masyarakat pesisir melalui diversifikasi usaha perikanan.'
        },
        {
            url: '/images/gallery/foto6.jpeg',
            title: 'Konservasi Sumber Daya Laut',
            description: 'Kegiatan pelestarian dan konservasi ekosistem laut untuk keberlanjutan perikanan.'
        },
        {
            url: '/images/gallery/foto7.jpeg',
            title: 'Workshop Pengolahan Hasil Perikanan',
            description: 'Pelatihan pengolahan dan pengemasan produk perikanan untuk meningkatkan nilai tambah.'
        },
        {
            url: '/images/gallery/foto8.jpeg',
            title: 'Kemitraan dengan Nelayan',
            description: 'Membangun kemitraan strategis dengan kelompok nelayan untuk pengembangan sektor perikanan.'
        }
    ];

    // Hero images untuk carousel
    const heroImages = [
        '/images/gallery/foto1.jpeg',
        '/images/gallery/foto2.jpeg',
        '/images/gallery/foto3.jpeg'
    ];

    // Effect untuk scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect untuk hero carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="DISKP Sumut - Sistem Pengelolaan Kegiatan" />
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
                {/* Header / Navigasi */}
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-[#25335C]/95 backdrop-blur-md shadow-lg' : 'bg-[#25335C]'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <img className="h-10 w-auto rounded-lg shadow-sm" src="/images/logo-sumut.jpg" alt="Logo DISKP Sumut" />
                                <div className="ml-3 text-white">
                                    <span className="font-bold text-lg block leading-tight">DISKP SUMUT</span>
                                    <span className="text-xs opacity-90 hidden sm:block">Dinas Kelautan dan Perikanan</span>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                <a href="#beranda" className="text-white hover:text-blue-200 transition-colors font-medium">Beranda</a>
                                <a href="#kegiatan" className="text-white hover:text-blue-200 transition-colors font-medium">Kegiatan</a>
                                <a href="#galeri" className="text-white hover:text-blue-200 transition-colors font-medium">Galeri</a>
                                <a href="#kontak" className="text-white hover:text-blue-200 transition-colors font-medium">Kontak</a>
                            </nav>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isMobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>

                            {/* Login Button */}
                            <div className="hidden md:block">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-[#25335C] shadow-sm hover:bg-gray-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 transform hover:scale-105"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Navigation Menu */}
                        {isMobileMenuOpen && (
                            <div className="md:hidden border-t border-white/20">
                                <div className="px-2 pt-2 pb-3 space-y-1 bg-[#25335C]/95 backdrop-blur-md">
                                    <a href="#beranda" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors">Beranda</a>
                                    <a href="#kegiatan" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors">Kegiatan</a>
                                    <a href="#galeri" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors">Galeri</a>
                                    <a href="#kontak" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors">Kontak</a>
                                    <Link
                                        href={route('login')}
                                        className="block mx-3 mt-4 px-4 py-2 bg-white text-[#25335C] rounded-md text-center font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section id="beranda" className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Carousel */}
                    <div className="absolute inset-0">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Hero ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#25335C]/80 via-[#25335C]/60 to-transparent"></div>
                            </div>
                        ))}
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                <span className="block animate-fade-in-up">Sistem Pengelolaan</span>
                                <span className="block animate-fade-in-up animation-delay-200 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Kegiatan Bidang Tangkap
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-400 leading-relaxed">
                                Sistem Pengelolaan Kegiatan Berbasis Website Pada Bidang Perikanan Tangkap 
                                <br className="hidden sm:block" />
                                Dinas Kelautan dan Perikanan Sumatera Utara
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                                <a
                                    href="#galeri"
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Jelajahi Kegiatan
                                </a>
                                <a
                                    href="#kontak"
                                    className="border-2 border-white text-white hover:bg-white hover:text-[#25335C] px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Hubungi Kami
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="kegiatan" className="py-16 sm:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Program & Kegiatan Unggulan
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Berbagai program inovatif untuk mendukung kemajuan sektor perikanan dan kelautan di Sumatera Utara
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "🚤",
                                    title: "Bantuan Sarana Penangkapan",
                                    description: "Pemberian bantuan perahu, jaring, dan peralatan penangkapan modern"
                                },
                                {
                                    icon: "📊",
                                    title: "Monitoring Digital",
                                    description: "Sistem monitoring hasil tangkapan berbasis teknologi digital"
                                },
                                {
                                    icon: "🎓",
                                    title: "Pelatihan & Edukasi",
                                    description: "Program pelatihan untuk meningkatkan kapasitas nelayan"
                                },
                                {
                                    icon: "🌊",
                                    title: "Konservasi Laut",
                                    description: "Program pelestarian ekosistem laut dan sumber daya perikanan"
                                },
                                {
                                    icon: "🤝",
                                    title: "Kemitraan Strategis",
                                    description: "Membangun kemitraan dengan berbagai pihak untuk kemajuan bersama"
                                },
                                {
                                    icon: "💡",
                                    title: "Inovasi Teknologi",
                                    description: "Penerapan teknologi terdepan dalam sektor perikanan"
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#25335C] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="galeri" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Dokumentasi Kegiatan
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Melihat lebih dekat berbagai kegiatan dan program yang telah dilaksanakan
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {galleryImages.map((image, index) => (
                                <article
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">
                                            {image.title}
                                        </h3>
                                        <p className="text-white/90 text-sm leading-relaxed drop-shadow">
                                            {image.description}
                                        </p>
                                    </div>

                                    <div className="p-4 lg:p-6">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#25335C] transition-colors">
                                            {image.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                            {image.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 sm:py-24 bg-[#25335C] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Pencapaian & Statistik
                            </h2>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Data dan pencapaian program yang telah direalisasikan
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { number: "6 Unit ", label: "Pengadaan Alat Tangkap Ikan", icon: "🚤" },
                                { number: "79 lokasi", label: "Mengembangkan Kampung Nelayan", icon: "👥" },
                                { number: "2.481.303", label: "Peningakatan  Pendapatan Pembudidaya Ikan", icon: "⭐" },
                                { number: "66.706,65 Ton", label: "Ekspor   Hasil   Perikanan ", icon: "📅" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-lg opacity-90">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="kontak" className="py-16 sm:py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                            Hubungi Kami
                        </h2>
                        <p className="text-xl text-gray-600 mb-12">
                            Untuk informasi lebih lanjut mengenai program dan kegiatan kami
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                                <div className="text-3xl mb-4">📍</div>
                                <h3 className="font-bold text-gray-900 mb-2">Alamat</h3>
                                <p className="text-gray-600 text-center">Jl. Sei Batu Gingging Ps. X No.6, Merdeka, Kec. Medan Baru, Kota Medan<br/>, Sumatera Utara 20153</p>
                            </div>
                            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                                <div className="text-3xl mb-4">📞</div>
                                <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
                                <p className="text-gray-600">(061) 4568819</p>
                            </div>
                            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                                <div className="text-3xl mb-4">✉️</div>
                                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600">ppid.dkp@sumutprov.go.id. </p>
                            </div>
                        </div>

                        <Link
                            href={route('login')}
                            className="inline-block bg-gradient-to-r from-[#25335C] to-blue-700 hover:from-blue-800 hover:to-[#25335C] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Akses Sistem →
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-[#25335C] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Logo & Description */}
                        <div>
                            <div className="flex items-center mb-4">
                                <img className="h-12 w-auto rounded-lg" src="/images/logo-sumut.jpg" alt="Logo DISKP Sumut" />
                                <div className="ml-3">
                                    <span className="font-bold text-lg block">DISKP SUMUT</span>
                                    <span className="text-sm opacity-80">Dinas Kelautan dan Perikanan</span>
                                </div>
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed">
                                Memajukan sektor kelautan dan perikanan Sumatera Utara melalui inovasi, pemberdayaan, dan pelayanan terbaik.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#beranda" className="opacity-90 hover:opacity-100 hover:text-cyan-400 transition-colors">Beranda</a></li>
                                <li><a href="#kegiatan" className="opacity-90 hover:opacity-100 hover:text-cyan-400 transition-colors">Kegiatan</a></li>
                                <li><a href="#galeri" className="opacity-90 hover:opacity-100 hover:text-cyan-400 transition-colors">Galeri</a></li>
                                <li><a href="#kontak" className="opacity-90 hover:opacity-100 hover:text-cyan-400 transition-colors">Kontak</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Kontak</h3>
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center opacity-90">
                                    <span className="mr-2">📍</span>
                                    Provinsi Sumatera Utara
                                </p>
                                <p className="flex items-center opacity-90">
                                    <span className="mr-2">📞</span>
                                    (061) 4568819
                                </p>
                                <p className="flex items-center opacity-90">
                                    <span className="mr-2">✉️</span>
                                    info@diskp.sumutprov.go.id
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-8 pt-8 text-center">
                        <p className="text-sm opacity-80">
                            &copy; 2025 Dinas Kelautan dan Perikanan Sumatera Utara. Seluruh hak cipta dilindungi.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </>
    );
}