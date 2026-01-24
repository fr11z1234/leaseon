'use client';
import { listingStore } from "@/stores/ListingStore";
import { Listing } from "@/types/Listing";

export default function ({ carDetails }: { carDetails: Listing }) {
    const loading = listingStore(s => s.loading);
    const getContactDetails = () => {
        listingStore.getState().fetchContactDetails(carDetails.user_id?.toString() ?? '');
    }
    return (
        <div className='w-full flex flex-row justify-start gap-4'>
            <button onClick={getContactDetails} className="flex items-center px-6 py-3.5 bg-blue-600 text-white rounded min-w-fit hover:opacity-80 transition ease-in duration-100 cursor-pointer gap-3">
                {loading ? 'Henter...' : 'Skriv til sælger'}
            </button>
            <button className="flex items-center px-6 py-3.5 bg-blue-200 text-white rounded min-w-fit hover:opacity-80 transition ease-in duration-100 cursor-pointer gap-3">
                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#2563eb"><path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.5 6.5L8.5 10.5" stroke="#2563eb" strokeWidth="1.5"></path><path d="M8.5 13.5L15.5 17.5" stroke="#2563eb" strokeWidth="1.5"></path></svg>
            </button>
        </div>
    )
}