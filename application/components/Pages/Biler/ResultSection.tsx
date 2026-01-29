'use client';
import ListingCard from '@/components/cards/ListingCard';
import loadingLottie from '@/lottie/loading.json';
import { Player } from '@lottiefiles/react-lottie-player';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import Pagination from '@/components/Pages/Biler/Pagination';
import { listingStore } from '@/stores/ListingStore';
import { debounce } from 'lodash';

export default function () {

    const [initialLoading, setInitialLoading] = useState(true);
    const filters = listingStore((state) => state.search) as any;
    const loading = listingStore((state) => state.loading);
    const listings = listingStore((state) => state.listings);

    const searchParams = useSearchParams();
    const query = new URLSearchParams(searchParams.toString()) as any;


    useEffect(() => {
        filterResults();
    }, [filters]);


    const filterResults = useCallback(
        debounce(() => listingStore.getState().fetchListings(), 500, {trailing: true, leading: true}), []
    );

    // Fetch listings with filters
    useEffect(() => {
        if (!loading) {
            setInitialLoading(false);
        }
    }, [loading]);

    // Fetch listings with filters
    useEffect(() => {
        const keys = [...query.keys()];
        const options = ['brand', 'model', 'transmission_type', 'fuel_type', 'form'];

        if (initialLoading && options.some(option => keys.includes(option))) {
            setInitialLoading(false);
            return;
        }

    }, [filters]);

    return (
        <>
            <div className={'w-full h-auto flex flex-wrap justify-center lg:justify-start gap-8 pb-6 max-w-[1140px] sm:gap-3' + (loading || initialLoading ? ' !justify-center' : '')}>
                {loading || initialLoading ? (
                    <div>
                        <Player
                            autoplay
                            loop
                            src={loadingLottie}
                            style={{ height: '180px', width: '300px' }}
                        >
                        </Player>
                    </div>
                ) : listings.length > 0 ? (
                    listings.map((car: any) => (
                        <ListingCard key={car.listing_id} car={car} />
                    ))
                ) : (
                    <div className="w-full flex justify-center items-center">
                        <p className="text-xl text-gray-600">Ingen resultater matcher din søgning</p>
                    </div>
                )}

            </div>

            <Pagination />
        </>
    )
}