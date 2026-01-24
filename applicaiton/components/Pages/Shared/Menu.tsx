'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/img/logo.svg';
import Sidebar from '@/components/Pages/Shared/Sidebar';
import { useState, useEffect } from 'react';

export default function Menu() {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setIsScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 w-full h-30 flex items-center z-50 justify-center px-4 sm:px-0 ease-in-out transition ${isScrolled ? 'bg-white' : 'bg-none'}`}>
            <div className='w-full flex flex-row max-w-laptop justify-between items-center py-2'>
                <Link href="/">
                    <Image src={logo} alt="Leaseon" className="w-[200px] h-auto" />
                </Link>
                < Sidebar />
            </div>
        </div>
    );
};