'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '@/components/Loader'
import { userStore } from '@/stores/UserStore';
import DefaultUser from '@/types/User';
import EventEmitter from '@/EventEmitter';
import { useRouter } from 'next/navigation';

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                        transition-all duration-500 ease-out
                        ${step < currentStep
                            ? 'bg-green-500 text-white'
                            : step === currentStep
                                ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30'
                                : 'bg-gray-200 text-gray-500'
                        }
                    `}>
                        {step < currentStep ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            step
                        )}
                    </div>
                    {step < totalSteps && (
                        <div className={`w-12 h-1 mx-1 rounded transition-all duration-500 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

// Step titles (step 3 has two sub-views)
const getStepTitle = (currentStep: number, hasClickedVidere: boolean) => {
    if (currentStep === 1) return { title: 'Opret login', subtitle: 'Vælg din email og adgangskode' };
    if (currentStep === 2) return { title: 'Personlige oplysninger', subtitle: 'Fortæl os lidt om dig selv' };
    if (currentStep === 3 && !hasClickedVidere) return { title: 'Verificer din email', subtitle: 'Tjek din indbakke (og spam)' };
    return { title: 'Velkommen!', subtitle: 'Din konto er nu oprettet' };
};

export default function () {

    const router = useRouter();
    const [formData, setFormData] = useState(DefaultUser());
    const [errors, setErrors] = useState({} as any);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [hasClickedVidere, setHasClickedVidere] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const validate = () => {
        let validationErrors = {} as any;
        if (!formData.email) validationErrors.email = "Email er påkrævet";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = "Email er ugyldig";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;
        if (!acceptedTerms) {
            EventEmitter.emit('notify', 'Du skal acceptere handelsbetingelserne');
            return;
        }

        setIsSubmitting(true);
        const result = await userStore.getState().createUser(formData);

        if (result) {
            EventEmitter.emit('notify', 'Din profil er oprettet!');
            setDirection('forward');
            setCurrentStep(3);
        } else {
            EventEmitter.emit('notify', 'Der er sket en fejl, prøv igen!');
        }
        setIsSubmitting(false);
    };

    const goToStepTwo = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            EventEmitter.emit('notify', 'Udfyld venligst alle felter');
            return;
        }
        if (formData.password.length < 6) {
            EventEmitter.emit('notify', 'Adgangskoden skal være mindst 6 tegn');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            EventEmitter.emit('notify', 'Adgangskoderne matcher ikke');
            return;
        }
        setDirection('forward');
        setCurrentStep(2);
    };

    const goBack = () => {
        setDirection('backward');
        setCurrentStep(currentStep - 1);
    };

    return (
        <div className='w-full min-h-screen flex items-center justify-center bg-primary-faded pt-20 pb-10 px-4 sm:pt-24 sm:pb-12'>

            <Head>
                <title>Leaseon.dk - Opret en konto</title>
                <meta name="description" content={`Opret din konto på den eneste leasingannoncerings platform for private - leasingovertagelser - leaseon.dk`} />
            </Head>

            <div className='w-full max-w-md'>
                {/* Card */}
                <div className='bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'>
                    {/* Header */}
                    <div className='bg-blue-600 px-8 py-6 text-white'>
                        <h1 className='text-xl font-bold mb-1'>{getStepTitle(currentStep, hasClickedVidere).title}</h1>
                        <p className='text-blue-100 text-sm'>{getStepTitle(currentStep, hasClickedVidere).subtitle}</p>
                    </div>

                    {/* Step indicator */}
                    <div className='px-8 pt-6'>
                        <StepIndicator currentStep={currentStep} totalSteps={3} />
                    </div>

                    {/* Form content */}
                    <div className='px-8 pb-8'>
                        <form id="register-form" onSubmit={handleSubmit}>
                            {/* Step 1 - Login info */}
                            <div className={`
                                transition-all duration-400 ease-out
                                ${currentStep === 1
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 absolute pointer-events-none ' + (direction === 'forward' ? '-translate-x-8' : 'translate-x-8')
                                }
                            `}>
                                {currentStep === 1 && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='flex flex-col gap-1'>
                                            <label>Email</label>
                                            <input
                                                className='input-own w-full'
                                                type="email"
                                                name="email"
                                                placeholder="din@email.dk"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>Adgangskode</label>
                                            <input
                                                className='input-own w-full'
                                                type="password"
                                                name="password"
                                                placeholder="Mindst 6 tegn"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>Bekræft adgangskode</label>
                                            <input
                                                className='input-own w-full'
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Gentag adgangskode"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <button
                                            className="primary-button w-full mt-2"
                                            type="button"
                                            onClick={goToStepTwo}
                                        >
                                            Fortsæt
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>

                                        <p className='text-center text-sm text-slate-500 mt-2'>
                                            Har du allerede en konto? <Link href="/dashboard" className='text-blue-500 hover:underline'>Log ind</Link>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Step 2 - Personal info */}
                            <div className={`
                                transition-all duration-400 ease-out
                                ${currentStep === 2
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 absolute pointer-events-none ' + (direction === 'forward' ? 'translate-x-8' : '-translate-x-8')
                                }
                            `}>
                                {currentStep === 2 && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex flex-col gap-1'>
                                                <label>Fornavn</label>
                                                <input
                                                    className='input-own w-full'
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="Anders"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <label>Efternavn</label>
                                                <input
                                                    className='input-own w-full'
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Andersen"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>Telefon</label>
                                            <input
                                                className='input-own w-full'
                                                type="text"
                                                name="phone"
                                                placeholder="12 34 56 78"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>By</label>
                                            <input
                                                className='input-own w-full'
                                                type="text"
                                                name="city"
                                                placeholder="København"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>Facebook profil <span className='text-slate-400 font-normal'>(valgfri)</span></label>
                                            <input
                                                className='input-own w-full'
                                                type="text"
                                                name="facebookProfile"
                                                placeholder="facebook.com/dit-navn"
                                                value={formData.facebookProfile}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label>Profilbillede <span className='text-slate-400 font-normal'>(valgfri)</span></label>
                                            <input
                                                type="file"
                                                name="profilePicture"
                                                onChange={handleChange}
                                                className='input-own w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600'
                                            />
                                        </div>

                                        <label className='flex items-start gap-3 mt-2 cursor-pointer'>
                                            <input
                                                type="checkbox"
                                                checked={acceptedTerms}
                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                className='mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500'
                                            />
                                            <span className='text-sm text-slate-600'>
                                                Jeg har læst og accepterer <Link href="/handelsbetingelser" className='text-blue-500 hover:underline'>handelsbetingelserne</Link>
                                            </span>
                                        </label>

                                        <div className='flex gap-3 mt-4'>
                                            <button
                                                className="flex-1 border-button"
                                                type="button"
                                                onClick={goBack}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                                </svg>
                                                Tilbage
                                            </button>
                                            <button
                                                className="flex-[2] primary-button disabled:opacity-50 disabled:cursor-not-allowed"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader />
                                                        <span>Opretter...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Opret konto
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 3 - Verify email, then Success / Create listing prompt */}
                            <div className={`
                                transition-all duration-400 ease-out
                                ${currentStep === 3
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 absolute pointer-events-none translate-x-8'
                                }
                            `}>
                                {currentStep === 3 && !hasClickedVidere && (
                                    <div className='flex flex-col gap-5 py-2'>
                                        <div className='w-full bg-amber-50 border border-amber-200 rounded-lg p-5'>
                                            <p className='text-slate-700 text-sm font-medium mb-2'>Verificer din email</p>
                                            <p className='text-slate-600 text-sm mb-1'>Vi har sendt dig en bekræftelsesmail. Klik på linket i mailen for at aktivere din konto.</p>
                                            <p className='text-slate-600 text-sm font-medium'>Tjek spam.</p>
                                            <p className='text-slate-500 text-sm mt-3'>Det kan tage nogle minutter før du modtager mailen.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setHasClickedVidere(true)}
                                            className="primary-button w-full"
                                        >
                                            Videre (når du har verificeret)
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                {currentStep === 3 && hasClickedVidere && (
                                    <div className='flex flex-col items-center text-center gap-5 py-4'>
                                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        <div>
                                            <h3 className='text-lg font-bold text-slate-800 mb-1'>Tillykke, {formData.firstName || 'du'}!</h3>
                                            <p className='text-slate-600 text-sm'>Din konto er nu oprettet og klar til brug.</p>
                                        </div>

                                        <div className='w-full bg-blue-50 border border-blue-100 rounded-lg p-5 mt-1'>
                                            <p className='text-slate-700 text-sm font-medium mb-4'>Vil du oprette din første annonce nu?</p>
                                            <div className='flex flex-col gap-3'>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/dashboard/biler/opret')}
                                                    className="primary-button w-full"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Ja, opret annonce
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/dashboard/biler')}
                                                    className="border-button w-full"
                                                >
                                                    Nej, gå til dashboard
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer text */}
                <p className='text-center text-sm text-slate-500 mt-6'>
                    Ved at oprette en konto accepterer du vores <Link href="/handelsbetingelser" className='text-blue-500 hover:underline'>vilkår og betingelser</Link>
                </p>
            </div>
        </div>
    );
}
