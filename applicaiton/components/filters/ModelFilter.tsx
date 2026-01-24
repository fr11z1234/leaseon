'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PopularBrands from './subfilters/PopularBrands';
import SearchBrands from './subfilters/SearchBrands';
import SearchModels from './subfilters/SearchModels';
import { listingStore } from '@/stores/ListingStore';

export default function () {
    const searchParams = useSearchParams();
    const query = new URLSearchParams(searchParams.toString());
    const [open, setOpen] = useState(false);
    const selected = listingStore(s => s.search.brandFilter);
    const selected_models = listingStore(s => s.search.modelFilter);

    useEffect(() => {
        const model = query.get('model');
        const brand = query.get('brand');

        if (model) {
            selectModel(model, true);
        }

        if (brand) {
            selectBrand(brand, true);
        }
    }, []);

    const selectModel = (value: string, refresh = false) => {
        if(refresh){
            listingStore.setState({ search: { ...listingStore.getState().search, modelFilter: [value] } });
            return
        }
        let target = [];
        if (selected_models.includes(value)) {
            target = selected_models.filter(model => model !== value);
        } else {
            target = [...selected_models, value];
        }
        listingStore.setState({ search: { ...listingStore.getState().search, modelFilter: target } });
    };

    const selectBrand = (value: string, refresh = false) => {
        if(refresh){
            listingStore.setState({ search: { ...listingStore.getState().search, brandFilter: [value] } });
            return;
        }
        let target = [];
        if (selected.includes(value)) {
            target = selected.filter(brand => brand !== value);
        } else {
            target = [...selected, value];
        }
        listingStore.setState({ search: { ...listingStore.getState().search, brandFilter: target } });
    };

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center px-[30px] py-5 border-1 border-border bg-white rounded hover:!border-dark-faded cursor-pointer"
            >
                <p className="text-list">Mærke & Model</p>
                <div className="flex gap-2.5 items-center justify-center">
                    <div className={`flex items-center justify-center rounded-full w-[25px] h-[25px] bg-slate-900 ${selected.length + selected_models.length ? '' : 'hidden'}`}>
                        <p className="text-list text-white">{selected.length + selected_models.length}</p>
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
                className={`flex flex-col h-0 w-full gap-10 px-[30px] py-5 bg-white border-1 !border-border rounded ${open ? 'animate-filter' : 'hidden'
                    }`}
            >
                <PopularBrands selectBrand={selectBrand} selected={selected} />
                <SearchBrands selectBrand={selectBrand} selected={selected} />
                <SearchModels selectModel={selectModel} selected_models={selected_models} selected_brand={selected} />
            </div>
        </>
    );
};