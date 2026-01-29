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
            EventEmitter.emit('notify', 'forkert email eller password, prøv igen!');
        }
    }

    return (
        <div className='w-full h-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-blue-900'>
            <video autoPlay muted loop playsInline className='absolute z-0 w-auto pointer-events-none h-screen object-cover opacity-10 '>
                <source src={'/video/carbgvidm.mp4'} type="video/mp4" />
            </video>
            <div className='relative z-10 px-6 flex flex-col items-center justify-center  sm:px-20'>
                <div className='flex flex-col w-full max-w-lg items-center justify-center px-7 bg-white py-10 rounded-lg sm:px-14 fade-in'>
                    <Image src={logo} alt="Leaseon" className="w-[400px] h-auto mb-10" unoptimized />
                    <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className='flex flex-col'>
                            <label>Email:</label>
                            <input className='input-own'
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label>Password:</label>
                            <input className='input-own'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="primary-button" type="submit">Login</button>
                        <Link href="/opret-bruger" className='font-bold text-center text-blue-600 mt-1 bg-blue-100 py-3 hover:bg-blue-200 transition ease-in-out'>
                            Opret Ny Konto
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}