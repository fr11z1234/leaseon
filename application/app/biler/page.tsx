import SearchSection from '@/components/Pages/Biler/SearchSection';
import ResultSection from '@/components/Pages/Biler/ResultSection';
import { Suspense } from 'react'
import { Metadata } from 'next';
import Image from 'next/image';
import logo from '@/img/logo.svg';

export const metadata: Metadata = {
    title: "Leaseon.dk - Se alle leasingovertagelser og Find det bedste & billigste tilbud.",
    description: "Opret din konto på den eneste leasingannoncerings platform for private - leasingovertagelser - leaseon.dk",
};

export default function () {
    return (
        <Suspense fallback={<Image src={logo} alt="Leaseon" className="w-[200px] h-auto" unoptimized />}>
            <div className='w-full h-auto flex flex-col justify-center items-center gap-6'>
                <SearchSection />
                <ResultSection />
            </div>
        </Suspense>
    );
};