'use client';

import { userStore } from "@/stores/UserStore";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect } from "react";
import useFadeIn from "@/components/Pages/Shared/Fadein";
import { useRouter } from "next/navigation";
import EventEmitter from "@/EventEmitter";

export default function () {
    useFadeIn();
    const router = useRouter();
    const userInfo = userStore((state) => state.user);

    useEffect(() => {
        userStore.getState().checkAuth().then((isLoggedIn) => {
            if (isLoggedIn) {
                userStore.getState().fetchUser();
            } else {
                router.push('/dashboard');
            }
        });
    }, []);


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        userStore.setState({ user: { ...userInfo, [name]: value } });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await userStore.getState().updateUser();
        if (res) EventEmitter.emit('notify', 'Dine oplysninger er blevet opdateret')
        else EventEmitter.emit('notify', 'Kunne ikke opdatere dine oplysninger, prøv igen!')
    }

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
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-col gap-4 justify-center text-center items-center h-fit mb-8 sm:text-start sm:flex-row w-full sm:justify-start sm:gap-0'>
                                <h1 className='text-2xl font-bold text-center items-center w-full'>Dine Oplysninger</h1>
                            </div>
                            <form className='w-full flex flex-col justify-center items-center' onSubmit={handleSubmit}>
                                <div className='w-full sm:max-w-[600px] flex flex-col gap-4'>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={userInfo.firstName}
                                        onChange={handleFormChange}
                                        placeholder="Fornavn"
                                        className="input-own"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userInfo.lastName}
                                        onChange={handleFormChange}
                                        placeholder="Efternavn"
                                        className="input-own"
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userInfo.phone}
                                        onChange={handleFormChange}
                                        placeholder="Tlf nr."
                                        className="input-own"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        value={userInfo.city}
                                        onChange={handleFormChange}
                                        placeholder="By"
                                        className="input-own"
                                    />
                                    <input
                                        type="text"
                                        name="facebookProfile"
                                        value={userInfo.facebookProfile}
                                        onChange={handleFormChange}
                                        placeholder="Facebook Profil (valgfri)"
                                        className="input-own"
                                    />
                                    <button className='primary-button' type='submit'>Gem Ændringer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}