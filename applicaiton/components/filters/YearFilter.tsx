'use client';
import { listingStore } from '@/stores/ListingStore';
import React, { useState } from 'react';


const YearFilter = () => {
    const [open, setOpen] = useState(false);
    const maxYear = listingStore(s => s.search.maxYear);
    const minYear = listingStore(s => s.search.minYear);
    const maxKilometer = listingStore(s => s.search.maxKilometer);

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center px-[30px] py-5 border-1 !border-border bg-white rounded hover:!border-dark-faded cursor-pointer">
                <p className="text-list">Årgang & kilometerstand</p>
                <div className="flex gap-2.5 items-center justify-center">
                    <div className={`flex items-center justify-center rounded-full w-[25px] h-[25px] bg-slate-900 ${maxYear || minYear || maxKilometer ? '' : 'hidden'}`}>
                        <p className="text-2xl text-white">•</p>
                    </div>
                    <svg
                        className={`transition-all ${open ? 'rotate-180' : 'rotate-0'}`}
                        width="20"
                        height="12"
                        viewBox="0 0 20 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.0533 11.148L19.6479 2.58267C20.1173 2.084 20.1173 1.32133 19.6479 0.852C19.1786 0.382667 18.3866 0.382667 17.9173 0.852L10.2026 8.56667L2.48794 0.852C1.98927 0.382667 1.22661 0.382667 0.757273 0.852C0.28794 1.32133 0.28794 2.084 0.757273 2.58267L9.3226 11.148C9.82127 11.6173 10.5839 11.6173 11.0533 11.148Z"
                            fill="black"
                        />
                    </svg>
                </div>
            </div>
            <div
                className={`flex flex-col h-0 w-full gap-10 px-[30px] py-5 bg-white border-1 !border-border rounded ${open ? 'animate-filter-small' : 'hidden'
                    }`}
            >


                <div className="flex flex-col">
                    <p className="text-list text-dark">Årgang</p>
                    <div className="flex items-center gap-2.5 w-full">

                        <input
                            type="number"
                            placeholder="Fra"
                            value={minYear}
                            onChange={(e) => {
                                listingStore.setState({ search: { ...listingStore.getState().search, minYear: e.target.value } });
                            }}
                            className="input-own w-full"
                        />
                        <p>-</p>
                        <input
                            type="number"
                            placeholder="Til"
                            value={maxYear}
                            onChange={(e) => {
                                listingStore.setState({ search: { ...listingStore.getState().search, maxYear: e.target.value } });
                            }}
                            className="input-own w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-list text-dark">Kilometer</p>
                    <div className="flex gap-2.5 w-full">
                        <input
                            type="number"
                            placeholder="Maximum antal kilometer"
                            value={maxKilometer}
                            onChange={(e) => {
                                listingStore.setState({ search: { ...listingStore.getState().search, maxKilometer: e.target.value } });
                            }}
                            className="input-own w-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default YearFilter;