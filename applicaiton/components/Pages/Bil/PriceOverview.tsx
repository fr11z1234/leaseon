import { Listing } from "@/types/Listing";
import ContactDetailButton from "./ContactDetailButton";

export default function ({ carDetails }: { carDetails: Listing }) {
    return (
        <div className='w-full flex flex-col p-10 bg-white border-gray-200 border rounded-sm'>
            <div className='w-full flex flex-col justify-start items-start gap-4  '>
                <div className='flex flex-col gap-4 md:gap-0 md:flex-row justify-between w-full'>
                    <h2 className='text-2xl text-slate-900'>Prisoversigt</h2>
                    <span className="bg-emerald-100 text-md font-medium text-green-500 rounded px-4 py-1 flex max-h-fit">💸 {(carDetails.discount ?? 0).toLocaleString('de-DE')} DKK</span>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-1'>
                    <p className='text-slate-600 '>Original Udbetaling</p>
                    <h3 className='text-3xl text-gray-300 font-bold mb-3 line-through'>{(carDetails.payment ?? 0).toLocaleString('de-DE')} DKK</h3>
                    <p className='text-slate-600 '>Din Udbetaling (inkl moms.)</p>
                    <h3 className='text-3xl text-blue-600 font-bold mb-3'>{((carDetails.payment - carDetails.discount) ?? 0).toLocaleString('de-DE')} DKK</h3>
                    <p className='text-slate-600 '>Mnd. Ydelse (inkl moms)</p>
                    <h3 className='text-3xl text-slate-900 font-bold mb-3'>{(carDetails.month_payment ?? 0).toLocaleString('de-DE')} DKK</h3>
                    <p className='text-slate-600 '>Leasing Periode</p>
                    <h3 className='text-3xl text-slate-900 font-bold mb-3'>{carDetails.lease_period} Måneder</h3>
                    <ContactDetailButton carDetails={carDetails} />
                </div>
            </div>
        </div>
    )
}