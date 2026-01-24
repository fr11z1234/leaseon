import suv from '@/img/suv.svg';
import sedan from '@/img/sedan.svg';
import stationcar from '@/img/stationcar.svg';
import van from '@/img/van.svg';
import cabriolet from '@/img/cabriolet.svg';
import coupe from '@/img/coupe.svg';
import crossover from '@/img/crossover.svg';
import hatchback from '@/img/hatchback.svg';
import Link from "next/link";
import Image from 'next/image';

export default function TypeSection() {

    return (
        <div className='h-auto bg-white pt-44 pb-20 items-center flex flex-col'>
            <h3 className='text-xl font-bold text-slate-900 fade-in'>Søg efter biltype</h3>
            <div className='flex-row flex w-full gap-4 max-w-laptop flex-wrap justify-center py-7 fade-in'>
                <Link href='/biler?form=SUV' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={suv} alt='SUV car' className='w-full' />
                    <p className='text-sm'>SUV</p>
                </Link>
                <Link href='/biler?form=Crossover' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={crossover} alt='Crossover car' className='w-full' />
                    <p className='text-sm'>Crossover</p>
                </Link>
                <Link href='/biler?form=Coupe' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={coupe} alt='coupe car' className='w-full' />
                    <p className='text-sm'>Coupe</p>
                </Link>
                <Link href='/biler?form=Stationcar' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={stationcar} alt='stationcar car' className='w-full' />
                    <p className='text-sm'>Stationcar</p>
                </Link>
                <Link href='/biler?form=Hatchback' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={hatchback} alt='hatchback car' className='w-full' />
                    <p className='text-sm'>Hatchback</p>
                </Link>
                <Link href='/biler?form=Sedan' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={sedan} alt='sedan car' className='w-full' />
                    <p className='text-sm'>Sedan</p>
                </Link>
                <Link href='/biler?form=Van' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={van} alt='van car' className='w-full' />
                    <p className='text-sm'>Van</p>
                </Link>
                <Link href='/biler?form=Cabriolet' className='border flex flex-col gap-2 border-gray-200 lg:w-32 lg:h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                    <Image src={cabriolet} alt='cabriolet car' className='w-full' />
                    <p className='text-sm'>cabriolet</p>
                </Link>
            </div>
        </div>
    )
}