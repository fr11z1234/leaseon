'use client';
import React, { useState } from 'react';
import { listingStore } from "@/stores/ListingStore";
import filtersSvg from '@/img/filters.svg';
import ModelFilter from '@/components/filters/ModelFilter';
import YearFilter from '@/components/filters/YearFilter';
import PriceFilter from '@/components/filters/PriceFilter';
import TypeFilter from '@/components/filters/TypeFilter';
import useFadeIn from '@/components/Pages/Shared/Fadein';
import Image from 'next/image';

export default function SearchSection() {
    useFadeIn();
    const [showFilters, setShowFilters] = useState(false);
    const listings = listingStore(s => s.listings);
    const loading = listingStore(s => s.loading);
    const search = listingStore(s => s.search);


    const resetFilters = () => {
        listingStore.getState().resetFilters();
    }


    return (
        <React.Fragment>
            <div className='flex flex-col w-full mt-[120px] max-w-[1140px] gap-4 px-5 lg:px-0 md:flex-row'>
                <input
                    placeholder="Søg på bil, mærke, model..."
                    onChange={(e) => { listingStore.setState({ search: { ...search, search: e.target.value.split(' ') } }) }}
                    className="input-own w-full"
                />
                <button
                    onClick={() => setShowFilters(prev => !prev)}
                    className="flex gap-2 justify-center text-white bg-blue-600 px-6 py-2 h-[45px] items-center rounded mb-4 whitespace-nowrap">
                    <Image src={filtersSvg} alt="filters" unoptimized /> Alle filtre
                </button>
            </div>
            <div className={'bg-black/50 w-full h-full fixed z-50 top-0 left-0 fade-in ' + (showFilters ? ' fade-in-clean-visible' : ' hidden')} onClick={() => setShowFilters(false)}></div>
            <div className={`fixed overflow-auto w-full lg:w-[710px] top-0 h-full gap-20 z-50 bg-custom-background transition-all ${showFilters ? 'right-0' : 'right-[-100%] lg:right-[-710px]'}`}>
                <div className="flex flex-col gap-5 px-7 pt-12">
                    <p className="text-subtitle">Hvilken bil søger du ?</p>
                    <ModelFilter />
                    <YearFilter />
                    <PriceFilter />
                    <TypeFilter />
                </div>

                <div className='flex sticky bg-custom-background bottom-0 items-center mt-10 justify-between border-t border-b border-gray-300 py-5 px-7'>
                    <h5 className='text-lg text-blue-600 font-bold'>{loading ? 'SØGER...' : listings.length + ' BILER MATCHER'}</h5>

                    <div className='flex gap-4'>
                        <button onClick={resetFilters} className="bg-white border border-blue-600 text-list text-blue-600 h-[55px] px-6 py-2.5 rounded">
                            Nulstil
                        </button>

                        <button className="bg-blue-600 whitespace-nowrap text-list text-white h-[55px] px-6 py-2.5 rounded" onClick={() => setShowFilters(false)}>
                            Vis Biler
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}