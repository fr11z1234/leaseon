import { Listing } from "@/types/Listing";

export default function ({ carDetails }: { carDetails: Listing }) {
    return (
        <div className='w-full flex flex-col p-10 bg-white border-gray-200 border rounded-sm'>
            <div className='w-full flex flex-col justify-start items-start gap-4  '>
                <div className='flex flex-row justify-start w-full'>
                    <h2 className='text-2xl text-slate-900'>Hele Perioden</h2>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-1'>
                    <p className='text-slate-600 '>Restværdi (eksl. afgift & Moms) </p>
                    <h3 className='text-3xl text-slate-900 font-bold mb-3'>{(carDetails.payment ?? 0).toLocaleString('de-DE')} DKK</h3>
                    <p className='text-slate-600 '>Samlet omkostninger for perioden</p>
                    <h3 className='text-3xl text-slate-900 font-bold mb-3'>{((carDetails.payment + ((carDetails.month_payment * 12) * 1.05)) ?? 0).toLocaleString('de-DE')} DKK</h3>
                </div>
            </div>
        </div>
    )
}