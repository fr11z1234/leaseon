'use client';

import Image from 'next/image';
import LoginOrProfileButton from '@/components/Pages/Shared/LoginOrProfileButton';
import adImg from '@/img/sidebarAnnonce.jpg';
import logo from '@/img/logo.svg';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link'
import { userStore } from '@/stores/UserStore';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null as any);
    const toggleBtnRef = useRef(null as any);
    const isLoggedIn = userStore((s) => s.isLoggedIn);
    const fetchAuth = userStore((s) => s.checkAuth);

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

    return (
        <div className=' flex flex-row w-fit px-4 sm:px-8'>
            {/* Burger Menu Icon / Cross */}
            <button ref={toggleBtnRef} onClick={toggleSidebar} className="z-50 relative cursor-pointer flex flex-row w-fit">
                {isOpen ? (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                )}
            </button>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-white z-40 pt-20 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out shadow-lg w-[100%] sm:w-[500px] flex flex-col px-4 sm:px-20 py-5`}>
                <div className='flex flex-col gap-6 items-center sm:items-start'>
                    <Image src={logo} alt="Leaseon" className="w-40 sm:w-[250px] h-auto mb sm:-ml-6 mb-4" />
                    <LoginOrProfileButton toggleSidebar={toggleSidebar} />
                    <span className='h-[1px] w-full bg-black/5' />
                    <Link prefetch={true} href="/" onClick={toggleSidebar}>
                        <button className='text-xl sm:text-[2rem] font-medium text-slate-900 hover:text-blue-500 w-full text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer'>Forside</button>
                    </Link>
                    <span className='h-[1px] w-full bg-black/5' />
                    <Link prefetch={true} href="/biler" onClick={toggleSidebar}>
                        <button className='text-xl sm:text-[2rem] font-medium text-slate-900 hover:text-blue-500 w-full text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer'>Se alle biler</button>
                    </Link>
                    {isLoggedIn && (
                        <>
                            <span className='h-[1px] w-full bg-black/5' />
                            <button onClick={logoutUser} className='text-xl sm:text-[2rem] font-medium text-red-500 hover:text-red-300 w-full text-center sm:text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer'>Log ud</button>
                        </>
                    )}
                </div>
                <Link href="/dashboard/biler/opret" onClick={toggleSidebar} className='!sm:d-block'>
                    <Image className='mt-12 sm:ml-auto sm:mr-auto' src={adImg} alt="Gratis annoncer i begrænset periode" />
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;