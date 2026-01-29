import { Listing } from "@/types/Listing";
import ImageGallery from "@/components/Pages/Bil/ImageGallery";
import Checkmark from '@/img/checkmark-blue.svg';
import Image from "next/image";

export default function ({ carDetails }: { carDetails: Listing }) {
    return (
        <div className='max-w-[700px] w-full flex flex-col justify-start items-start'>
            <ImageGallery images={carDetails.images} />
            <div className='w-full flex flex-col gap-4 p-10 bg-white border-gray-200 border rounded-sm mt-8'>
                <h2 className='text-2xl text-slate-900'>Beskrivelse</h2>
                <p>{carDetails.description}</p>
            </div>
            <div className='w-full flex flex-col gap-4 p-10 bg-white border-gray-200 border rounded-sm mt-8'>
                <h2 className='text-2xl text-slate-900'>Udstyr</h2>
                <ul className='w-full flex flex-row gap-4 flex-wrap '>
                    {carDetails.equipment && carDetails.equipment.map((equipment, index) => (
                        <li key={index} className="w-custom-half sm:w-custom-third py-2 border-b flex flex-row items-center"><Image alt="checkmark" className="w-auto max-w-[24px] h-auto object-contain mr-2" src={Checkmark} unoptimized />{equipment}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}