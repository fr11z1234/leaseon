'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/img/logo.svg';
import Sidebar from '@/components/Pages/Shared/Sidebar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Menu() {

    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname === '/dashboard') {
        return null;
    }

    return (
        <header className={`
            fixed top-0 left-0 right-0 z-50
            flex items-center justify-center
            h-16 sm:h-[72px]
            px-4 sm:px-6
            transition-all duration-300 ease-out
            ${isScrolled 
                ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-slate-200/80' 
                : 'bg-transparent'
            }
        `}>
            <div className='w-full max-w-laptop flex flex-row justify-between items-center'>
                <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-90">
                    <Image src={logo} alt="Leaseon" className="w-[160px] sm:w-[200px] h-auto" priority />
                </Link>
                <Sidebar />
            </div>
        </header>
    );
}