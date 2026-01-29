'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import registrerimage from '@/img/registrer-mid.png';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/Loader'
import { userStore } from '@/stores/UserStore';
import DefaultUser, { User } from '@/types/User';
import EventEmitter from '@/EventEmitter';
import { useRouter } from 'next/navigation';

export default function () {

    const router = useRouter();
    const [formData, setFormData] = useState(DefaultUser());
    const [errors, setErrors] = useState({} as any);
    const [currentStep, setCurrentStep] = useState(1);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const validate = () => {
        let validationErrors = {} as any;
        if (!formData.email) validationErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = "Email is invalid";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!!!validate()) return;

        const result = await userStore.getState().createUser(formData);
        if (result) {
            EventEmitter.emit('notify', 'Din profil er oprettet!');
            router.push('/dashboard/biler');
        } else {
            EventEmitter.emit('notify', 'Der er sket en fejl, prøv igen!');
        }
    };


    const goToStepTwo = () => {
        if (formData.password !== formData.confirmPassword) {
            EventEmitter.emit('notify', 'Passwords og gentag password matcher ikke');
        } else {
            setCurrentStep(currentStep + 1);
        }
    }


    return (
        <div className='w-full flex flex-row bg-primary-faded min-h-screen items-center justify-center pt-[76px] pb-[76px] sm:pb-0 sm:pt-0 px-6 sm:px-20'>

            <Head>
                <title>Leaseon.dk - Opret en konto</title>
                <meta name="description" content={`Opret din konto på den eneste leasingannoncerings platform for private - leasingovertagelser - leaseon.dk`} />
            </Head>

            <div className='w-full sm:w-laptop h-full flex items-center justify-center'>
                <div className='hidden sm:flex w-full h-full items-center justify-center'>
                    <Image src={registrerimage} alt="car" className="w-4/4 h-auto max-w-2xl" unoptimized />
                </div>
                <div className='flex flex-col w-full px-14 items-center justify-center bg-white py-10 rounded-lg'>
                    <h2 className='font-bold text-lg text-blue-600'>Opret Profil</h2>
                    <form className='w-full flex gap-4 flex-col' onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className='flex flex-col gap-4'>

                                <div className='flex flex-col'>
                                    <label>Email:</label>
                                    <input className='input-own' type="email" name="email" value={formData.email} onChange={handleChange} />
                                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                                </div>
                                <div className='flex flex-col'>
                                    <label>Adgangskode:</label>
                                    <input className='input-own' type="password" name="password" value={formData.password} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Bekræft Adgangskode:</label>
                                    <input className='input-own' type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                    {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
                                </div>
                                <button className="primary-button w-full mt-5" type="button" onClick={goToStepTwo}>
                                    {userStore.getState().loading ? <Loader /> : "Næste"}
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col w-full'>
                                    <label>Fornavn:</label>
                                    <input className='input-own' type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Efternavn:</label>
                                    <input className='input-own' type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Telefon:</label>
                                    <input className='input-own' type="text" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>By:</label>
                                    <input className='input-own' type="text" name="city" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Facebook Profil (valgfri):</label>
                                    <input className='input-own' type="text" name="facebookProfile" value={formData.facebookProfile} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Profil Billede:</label>
                                    <input type="file" name="profilePicture" onChange={handleChange} />
                                </div>
                                <div className='flex flex-row mt-4'>
                                    <input type="checkbox" name="profilePicture" required />
                                    <p className='text-sm ml-2'>Jeg har læst og acceptere <Link href="/handelsbetingelser" className='text-blue-500 !text-decoration-underline hover:text-black transition ease-in-out'>handelsbetingelserne</Link></p>
                                </div>
                                <button className='primary-button w-full mt-5' type="submit">{userStore.getState().loading ? <Loader /> : "Opret bruger"}</button>
                                <button className='text-center w-full mt-5' type="button" onClick={() => setCurrentStep(1)}>Tilbage</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
