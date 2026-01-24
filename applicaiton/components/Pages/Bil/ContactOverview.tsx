'use client';

import { listingStore } from "@/stores/ListingStore";

export default function () {
    const contactDetails = listingStore(s => s.listingContact);
    return (
        <div className={'w-full flex flex-col p-10 bg-white border-gray-200 border rounded-sm' + (contactDetails.email !== '' ? '' : ' hidden')}>
            <div className='w-full flex flex-col justify-start items-start gap-4  '>
                <div className='flex flex-row justify-between w-full'>
                    <h2 className='text-2xl text-slate-900'>Kontaktinformationer</h2>
                </div>
                <div className='flex flex-row justify-between w-full'>
                    <ul className='w-full'>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'>Navn</p><p className='font-bold'>{contactDetails.first_name} {contactDetails.last_name}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'>Tlf.</p><p className='font-bold'>{contactDetails.phone}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'>Email</p><p className='font-bold'>{contactDetails.email}</p></li>
                        <li className={"text-slate-600 py-3 border-b justify-between flex-row flex" + (contactDetails.facebook_profile !== '' ? '' : ' hidden')}><p className='flex-row flex gap-2'>Facebook</p><a className='text-blue-600 font-bold text-sm' href={contactDetails.facebook_profile}>Gå til</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}