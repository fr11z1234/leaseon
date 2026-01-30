'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import logo from '@/img/logo.svg';
import UseFadeIn from '@/components/Pages/Shared/Fadein';
import Link from 'next/link';
import Image from 'next/image';
import { userStore } from '@/stores/UserStore';
import { useRouter } from 'next/navigation';
import EventEmitter from '@/EventEmitter';

export default function () {
    UseFadeIn();

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        userStore.getState().checkAuth().then((isLoggedIn) => {
            if (isLoggedIn) {
                router.push('/dashboard/biler');
            }
        });
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await userStore.getState().login(email, password);
        if (success) {
            router.push('/dashboard/biler');
        } else {
            EventEmitter.emit('notify', 'Forkert email eller password, prøv igen!');
        }
    }

    return (
        <div className='w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-10 px-4'>
            <video autoPlay muted loop playsInline className='absolute inset-0 z-0 w-full h-full min-w-full min-h-full pointer-events-none object-cover opacity-10'>
                <source src={'/video/carbgvidm.mp4'} type="video/mp4" />
            </video>
            <div className='relative z-10 w-full max-w-md flex flex-col items-center gap-4'>
                <div className='bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden fade-in w-full'>
                    <div className='px-8 py-8'>
                        <Image src={logo} alt="Leaseon" className="w-40 h-auto mx-auto mb-6" unoptimized />
                        <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-1'>
                                <label>Email</label>
                                <input
                                    className='input-own w-full'
                                    type="email"
                                    placeholder="din@email.dk"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label>Adgangskode</label>
                                <input
                                    className='input-own w-full'
                                    type="password"
                                    placeholder="Din adgangskode"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className="primary-button w-full mt-2" type="submit">
                                Log ind
                            </button>
                            <p className='text-center text-sm text-slate-500 mt-4'>
                                Har du ikke en konto? <Link href="/opret-bruger" className='text-blue-500 hover:underline'>Opret ny konto</Link>
                            </p>
                        </form>
                    </div>
                </div>
                <Link href="/" className='fade-in text-sm text-white/90 hover:text-white transition-colors' style={{ animationDelay: '0.25s' }}>
                    Gå til forsiden
                </Link>
            </div>
        </div>
    );
}