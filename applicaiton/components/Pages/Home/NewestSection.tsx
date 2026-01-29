'use client';

import { useEffect, useState } from "react";
import ListingCard from "@/components/cards/ListingCard";
import { listingStore } from "@/stores/ListingStore"

export default function NewestSection() {
    const newestListings = listingStore((s) => s.newest);
    const [hasFetched, setHasFetched] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            await listingStore.getState().fetchNewest();
            setHasFetched(true);
        };
        fetchData();
    }, []);

    // Don't render anything until we've tried to fetch
    if (!hasFetched) {
        return null;
    }

    if (!newestListings || newestListings.length === 0) {
        return null;
    }

    return (
        <div className='w-full h-auto flex flex-col justify-center items-center'>
            <h2 className='text-center px-5 sm:pl-0 text-3xl text-slate-900 font-bold mb-5'>Nyeste Annoncer</h2>
            <p className='text-center px-5 sm:pl-0 text-50 text-sm text-slate-900'>De Nyeste opslag og leasingaftaler på hjemmesiden</p>
            <div className='w-full h-auto pt-10 pb-20 flex flex-row flex-wrap justify-center gap-3 max-w-laptop'>
                {newestListings.map((listing, index) => (
                    <ListingCard key={index} car={listing} />
                ))}
            </div>
        </div>
    )
}