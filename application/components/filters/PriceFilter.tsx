import { listingStore } from '@/stores/ListingStore';
import React, { useState } from 'react';


export default function () {
    const [open, setOpen] = useState(false);
    const maxMonthlyPayment = listingStore(s => s.search.maxMonthlyPayment);
    const maxPayment = listingStore(s => s.search.maxPayment);
    const minDiscount = listingStore(s => s.search.minDiscount);

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center px-[30px] py-5 border-1 !border-border bg-white rounded hover:!border-dark-faded cursor-pointer"
            >
                <p className="text-list">Aftale & Pris</p>
                <div className="flex gap-2.5 items-center justify-center">
                    <div className={`flex items-center justify-center rounded-full w-[25px] h-[25px] bg-slate-900 ${maxMonthlyPayment || maxPayment || minDiscount ? '' : 'hidden'}`}>
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
                    <p className="text-list text-dark">Udbetaling</p>
                    <div className="flex items-center gap-2.5 w-full">
                        <input
                            type="number"
                            placeholder="Maks Udbetaling"
                            value={maxPayment}
                            onChange={(e) => { listingStore.setState({ search: { ...listingStore.getState().search, maxPayment: e.target.value } }); }}
                            className="w-full input-own"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-list text-dark">Ydelse</p>
                    <div className="flex items-center gap-2.5 w-full">
                        <input
                            type="number"
                            placeholder="Maks Mnd Ydelse"
                            value={maxMonthlyPayment}
                            onChange={(e) => { listingStore.setState({ search: { ...listingStore.getState().search, maxMonthlyPayment: e.target.value } }); }}
                            className="input-own w-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-list text-dark">Præmie</p>
                    <div className="flex items-center gap-2.5 w-full">
                        <input
                            type="number"
                            placeholder="Min Præmie"
                            value={minDiscount}
                            onChange={(e) => { listingStore.setState({ search: { ...listingStore.getState().search, minDiscount: e.target.value } }); }}
                            className="input-own w-full min-h-10"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};