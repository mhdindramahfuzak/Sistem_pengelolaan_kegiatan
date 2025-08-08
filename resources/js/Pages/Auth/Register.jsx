import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Import file CSS khusus untuk halaman registrasi
import '../../../css/register.css';

// Komponen Ikon Panah Kembali
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Registrasi Akun" />
            
            {/* Menggunakan kelas 'register-container' dari register.css */}
            <div className="register-container">
                
                {/* Tombol Kembali */}
                <div className="w-full max-w-md mb-8 self-start lg:self-center lg:relative lg:-top-8 lg:left-[-2rem]">
                     <Link 
                        href={route('login')} 
                        className="back-button"
                        aria-label="Kembali ke halaman login"
                    >
                        <BackArrowIcon />
                    </Link>
                </div>

                <div className="w-full max-w-md text-center">
                    <h1 className="register-title">
                        Halaman Registrasi akun
                    </h1>

                    <form onSubmit={submit} className="space-y-6 text-left">
                        <div>
                            <label htmlFor="name" className="form-label">
                                Nama Pegawai
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan Nama pegawai"
                                className="form-input"
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email pegawai"
                                className="form-input"
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="password"
                                className="form-input"
                            />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="form-label">
                                Konfirmasi Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="masukkan password pegawai"
                                className="form-input"
                            />
                            {errors.password_confirmation && <p className="error-message">{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="submit-button"
                        >
                            Buat Akun
                        </button>
                    </form>
                </div>

                {/* Footer Copyright */}
                <div className="w-full max-w-md mt-16 text-center">
                    <p className="copyright-text">
                        Copyright © 2024, All rights reserved
                    </p>
                </div>
            </div>
        </>
    );
}
