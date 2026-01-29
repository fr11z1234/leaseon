'use client';
import { userStore } from '@/stores/UserStore';
import Link from 'next/link';

export default function ({ toggleSidebar }: any) {
    const isLoggedIn = userStore((state: any) => state.isLoggedIn);
    const handleButtonClick = () => {
        toggleSidebar();
    }

    return (
        <Link prefetch={true} href={isLoggedIn ? '/dashboard/biler' : '/dashboard'} className='text-xl sm:text-[2rem] font-medium text-slate-900 hover:text-blue-500 sm:w-full text-center sm:text-start hover:opacity-80 transition ease-in duration-100 cursor-pointer' onClick={handleButtonClick}>
            {isLoggedIn ? 'Min profil' : 'Log ind'}
        </Link>
    );
}