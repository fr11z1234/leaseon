'use client';

import { userStore } from "@/stores/UserStore";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import useFadeIn from "@/components/Pages/Shared/Fadein";
import EditableListingCard from "@/components/cards/EditableListingCard";
import { useRouter } from "next/navigation";

export default function () {
    useFadeIn();
    const listings = userStore((s) => s.listings);
    const router = useRouter();
    useEffect(() => {
        userStore.getState().checkAuth().then((isLoggedIn) => {
            if (isLoggedIn) {
                userStore.getState().fetchListings();
            } else {
                router.push('/dashboard');
            }
        });
    }, []);

    return (
        <div className='flex flex-row w-full fade-in'>
            <Head>
                <title>Leaseon.dk - Min Profil</title>
                <meta name="description" content={`Dine Annoncer & Oplysninger på den eneste leasingannoncerings platform for private - leasingovertagelser - leaseon.dk`} />
            </Head>
            <div className='flex flex-col justify-center items-center w-full bg-custom-background  py-20'>
                <div className='flex flex-col w-full p-6 sm:flex-row sm:w-[1240px] gap-4 sm:p-0'>
                    <div className='flex flex-col sm:w-1/5 bg-white rounded-md border border-gray-200 px-4 pt-4 sm:pb-[200px] pb-8 h-fit z-50 top-[80px]'>
                        <Link href='/dashboard/biler' className='flex flex-row gap-3 text-slate-900 font-medium text-md transition ease-in-out p-3 rounded-sm cursor-pointer border-b border-blue-100  hover:text-blue-500 hover:bg-blue-100 '>Mine Annoncer</Link>
                        <Link href='/dashboard/profil' className='flex flex-row gap-3 text-slate-900 font-medium text-md transition ease-in-out p-3 rounded-sm cursor-pointer border-b border-blue-100  hover:text-blue-500 hover:bg-blue-100 '>Mine Oplysninger</Link>
                    </div>
                    <div className='flex flex-col p-4 sm:w-5/6 lg:p-10 justify-center items-start bg-white rounded-md border border-gray-200'>
                        <div className='flex flex-row w-full flex-wrap gap-8 justify-start'>
                            <div className='flex flex-col gap-4 justify-center text-center items-center h-fit mb-8 sm:text-start sm:flex-row w-full sm:justify-start sm:gap-0'>
                                <h1 className='text-2xl font-bold text-between items-center w-full'>Dine annoncer</h1>
                                <Link href="/dashboard/biler/opret" className="primary-button text-nowrap">Opret annonce</Link>
                            </div>
                            {listings.map((listing, key) => (
                                <EditableListingCard car={listing} key={key} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}