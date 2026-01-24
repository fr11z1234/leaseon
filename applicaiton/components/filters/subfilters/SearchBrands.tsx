'use client';
import { carStore } from "@/stores/CarStore";
import { useEffect, useState } from "react";

type SearchBrandsProps = {
    selectBrand: (brand: string) => void,
    selected: string[]
}

export default function ({ selectBrand, selected }: SearchBrandsProps) {

    const fetchBrands = carStore(s => s.fetchBrands);
    fetchBrands(false);

    const brands = carStore(s => s.brands);
    const [search, setSearch] = useState("");

    const search_brands = brands.filter(
        brand => brand.value.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 10);

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-list text-dark">Søg efter mærke</p>

            <input
                placeholder="Indtast Mærke..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-own w-full"
            />

            <div className="flex flex-wrap gap-2.5">
                {search_brands.map((brand, index) => (
                    <div
                        key={index}
                        onClick={() => selectBrand(brand.value)}
                        className={`flex flex-col justify-center items-center w-[calc(50%-8px)] md:w-[calc(100%/5-8px)] h-[55px] opacity-100 !border-gray-200 border rounded hover:opacity-70 cursor-pointer gap-1 transition ${selected.includes(brand.value) && '!opacity-100 !border-blue-500 text-blue-500'
                            }`}
                    >
                        <p className='text-dark text-sm'>{brand.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};