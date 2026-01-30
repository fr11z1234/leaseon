'use client';

import Image from 'next/image';
import LoginOrProfileButton from '@/components/Pages/Shared/LoginOrProfileButton';
import adImg from '@/img/sidebarAnnonce.jpg';
import logo from '@/img/logo.svg';
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link'
import { userStore } from '@/stores/UserStore';
import { useRouter } from 'next/navigation';

const navLinkClass = 'flex items-center gap-3 w-full py-3 px-4 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium text-base sm:text-lg transition-colors duration-200';

const Sidebar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const sidebarRef = useRef(null as any);
    const toggleBtnRef = useRef(null as any);
    const isLoggedIn = userStore((s) => s.isLoggedIn);
    const fetchAuth = userStore((s) => s.checkAuth);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const logoutUser = async () => {
        router.push('/');
        setIsOpen(false);
        await userStore.getState().logout();
    };

    useEffect(() => {
        fetchAuth();
        const handleClickOutside = (event: any) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !toggleBtnRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when sidebar open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sidebarContent = (
        <>
            {/* Overlay - portaled to body so always above header when scrolling */}
            <div
                className={`
                    fixed inset-0 bg-black/20 z-[60]
                    transition-opacity duration-300 ease-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={toggleSidebar}
                aria-hidden="true"
            />

            {/* Sidebar panel - portaled to body so never hidden by nav bar */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed top-0 left-0 h-full z-[60]
                    w-full max-w-sm
                    bg-white
                    shadow-xl
                    flex flex-col
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
                        <Image src={logo} alt="Leaseon" className="w-32 sm:w-40 h-auto" />
                    </div>

                    <nav className="flex flex-col p-4 sm:p-6 gap-1">
                        <LoginOrProfileButton toggleSidebar={toggleSidebar} />
                        <div className="h-px bg-slate-200 my-4" />
                        <Link prefetch href="/" onClick={toggleSidebar} className={navLinkClass}>
                            <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Forside
                        </Link>
                        <Link prefetch href="/biler" onClick={toggleSidebar} className={navLinkClass}>
                            <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Se alle biler
                        </Link>
                        {isLoggedIn && (
                            <>
                                <div className="h-px bg-slate-200 my-4" />
                                <button
                                    onClick={logoutUser}
                                    className="flex items-center gap-3 w-full py-3 px-4 rounded-md text-red-600 hover:bg-red-50 font-medium text-base sm:text-lg transition-colors duration-200 text-left"
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Log ud
                                </button>
                            </>
                        )}
                    </nav>
                    <div className="mt-auto p-4 sm:p-6 pt-0 border-t border-slate-100">
                        <Link href="/dashboard/biler/opret" onClick={toggleSidebar} className="block rounded-lg overflow-hidden hover:opacity-95 transition-opacity">
                            <Image className="w-full" src={adImg} alt="Gratis annoncer i begrænset periode" />
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );

    return (
        <div className='flex flex-row w-fit pl-2 sm:pl-4'>
            <button
                ref={toggleBtnRef}
                onClick={toggleSidebar}
                className={`
                    relative flex items-center justify-center
                    w-10 h-10 sm:w-11 sm:h-11
                    rounded-md
                    transition-colors duration-200
                    hover:bg-slate-100 active:bg-slate-200
                    ${isOpen ? 'bg-slate-100' : ''}
                `}
                aria-label={isOpen ? 'Luk menu' : 'Åbn menu'}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Portal to body so overlay + sidebar are never hidden by the header when scrolling */}
            {mounted && createPortal(sidebarContent, document.body)}
        </div>
    );
};

export default Sidebar;