'use client';
import { userStore } from '@/stores/UserStore';
import Link from 'next/link';

export default function ({ toggleSidebar }: any) {
    const isLoggedIn = userStore((state: any) => state.isLoggedIn);
    const handleButtonClick = () => {
        toggleSidebar();
    }

    return (
        <Link
            prefetch
            href={isLoggedIn ? '/dashboard/biler' : '/dashboard'}
            onClick={handleButtonClick}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium text-base sm:text-lg transition-colors duration-200"
        >
            {isLoggedIn ? (
                <>
                    <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Min profil
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Log ind
                </>
            )}
        </Link>
    );
}