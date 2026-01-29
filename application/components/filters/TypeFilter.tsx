'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CarTypeFilter from './subfilters/CarTypeFilter';
import { listingStore } from '@/stores/ListingStore';
import FuelTypeFilter from './subfilters/FuelTypeFilter';
import GearTypeFilter from './subfilters/GearTypeFilter';

export default function () {
    const searchParams = useSearchParams();
    const query = new URLSearchParams(searchParams.toString());
    const [open, setOpen] = useState(false);
    const selected = listingStore(s => s.search.typeFilter);
    const selectedFuelTypes = listingStore(s => s.search.fuelFilter);
    const selectedTransmissionTypes = listingStore(s => s.search.gearFilter);


    useEffect(() => {
        const transmission_type = query.get('transmission_type');
        const fuel_type = query.get('fuel_type');
        const form = query.get('form');

        if (transmission_type) {
            listingStore.setState({ search: { ...listingStore.getState().search, gearFilter: [transmission_type] } });
        }

        if (fuel_type) {
            listingStore.setState({ search: { ...listingStore.getState().search, fuelFilter: [fuel_type] } });
        }

        if (form) {
            listingStore.setState({ search: { ...listingStore.getState().search, typeFilter: [form] } });
        }

    }, []);

    const selectFuelType = (type: string) => {
        let target = [];
        if (selectedFuelTypes.includes(type)) {
            target = selectedFuelTypes.filter((fuel) => fuel !== type);
        } else {
            target = [...selectedFuelTypes, type];
        }
        listingStore.setState({ search: { ...listingStore.getState().search, fuelFilter: target } });
    }

    const selectTransmissionTypes = (type: string) => {
        let target = [];
        if (selectedTransmissionTypes.includes(type)) {
            target = selectedTransmissionTypes.filter((transmission) => transmission !== type);
        } else {
            target = [...selectedTransmissionTypes, type];
        }
        listingStore.setState({ search: { ...listingStore.getState().search, gearFilter: target } });
    }

    const gear_types = [
        { value: 'Automatisk', label: 'Automatisk', id: 'Automatisk' },
        { value: 'Manuelt', label: 'Manuelt', id: 'Manuelt' },
    ];
    const fuel_types = [
        { value: 'Benzin', label: 'Benzin', id: 'Benzin' },
        { value: 'Diesel', label: 'Diesel', id: 'Diesel' },
        { value: 'El', label: 'El', id: 'Elektrisk' },
        { value: 'Hybrid - Benzin', label: 'Hybrid - Benzin', id: 'Hybrid-Benzin' },
        { value: 'Hybrid - Diesel', label: 'Hybrid - Diesel', id: 'Hybrid-Diesel' },
    ];

    const selectType = (id: string) => {
        let target = [];
        if (selected.includes(id)) {
            target = selected.filter(type => type !== id);
        } else {
            target = [...selected, id];
        }
        listingStore.setState({ search: { ...listingStore.getState().search, typeFilter: target } });
    };

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center px-[30px] py-5 border-1 !border-border bg-white rounded hover:!border-dark-faded cursor-pointer"
            >
                <p className="text-list">Biltype, Brændstof & Geartype</p>
                <div className="flex gap-2.5 items-center justify-center">
                    <div className={`flex items-center justify-center rounded-full w-[25px] h-[25px] bg-slate-900 ${selected.length + selectedFuelTypes.length + selectedTransmissionTypes.length ? '' : 'hidden'}`}>
                        <p className="text-list text-white">{selected.length + selectedFuelTypes.length + selectedTransmissionTypes.length}</p>
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
                <CarTypeFilter selectType={selectType} selected={selected} />
                <div className="flex gap-[30px]">
                    <FuelTypeFilter fuel_types={fuel_types} selected_types={selectedFuelTypes} select={selectFuelType} />
                    <GearTypeFilter gear_types={gear_types} selected_types={selectedTransmissionTypes} select={selectTransmissionTypes} />
                </div>
            </div>
        </>
    );
};
