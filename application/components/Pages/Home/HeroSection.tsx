'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { carStore } from '@/stores/CarStore';
import carImageHero1 from '@/img/posrche-hero.png';
import carImageHero2 from '@/img/Porsche-2.png';
import carImageHero3 from '@/img/mercedes-3.png';
import Image from "next/image";
import useFadeIn from '@/components/Pages/Shared/Fadein';

export default function TopFilter() {
    useFadeIn();
    const brandsOptions = carStore((state) => state.brands);
    const modelsOptions = carStore((state) => state.models);
    const [selectedBrand, setSelectedBrand] = useState(null as any);
    const [selectedModel, setSelectedModel] = useState(null as any);
    const [selectedGearType, setSelectedGearType] = useState(null as any);
    const [selectedFuelType, setSelectedFuelType] = useState(null as any);

    const [heroImage, setHeroImage] = useState(null as any)

    const { fetchBrands, fetchModels } = carStore();
    const router = useRouter();

    useEffect(() => {
        fetchBrands(false);
        setHeroImage(() => [carImageHero1, carImageHero2, carImageHero3].sort(() => Math.random() - 0.5)[0]);
    }, [])

    useEffect(() => {
        if (selectedBrand && selectedBrand.value) {
            fetchModels(selectedBrand.value);
        }
    }, [selectedBrand])

    const searchCars = () => {
        const queryParams = new URLSearchParams();

        if (selectedBrand?.value) {
            queryParams.set('brand', selectedBrand.value);
        }
        if (selectedModel?.value) {
            queryParams.set('model', selectedModel.value);
        }
        if (selectedGearType?.value) {
            queryParams.set('transmission_type', selectedGearType.value);
        }
        if (selectedFuelType?.value) {
            queryParams.set('fuel_type', selectedFuelType.value);
        }

        const queryString = queryParams.toString();
        const path = queryString ? `/biler?${queryString}` : '/biler';
        window.location.href = path
    };

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: state.isFocused ? '1px solid #E1E1E1' : '1px solid #E1E1E1',
            boxShadow: 'none',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),

        valueContainer: (provided: any) => ({
            ...provided,
            height: '55px',
            padding: '0 12px'
        }),

        input: (provided: any) => ({
            ...provided,
            margin: '0px',
        }),

        indicatorsContainer: (provided: any) => ({
            ...provided,
            height: '55px',
        }),

        clearIndicator: (provided: any) => ({
            ...provided,
            padding: '0px',
        }),

        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: '0px',
        }),

        option: (provided: any) => ({
            ...provided,
            padding: '10px 12px',
        }),
    };


    const gearTypeOptions = [
        { value: 'Automatisk', label: 'Automatisk' },
        { value: 'Manuelt', label: 'Manuelt' },
    ];


    const fuelTypeOptions = [
        { value: 'Benzin', label: 'Benzin' },
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Elektrisk', label: 'El' },
        { value: 'Hybrid-Benzin', label: 'Hybrid-Benzin' },
        { value: 'Hybrid-Diesel', label: 'Hybrid-Diesel' },
    ];

    return (
        <div className="w-full bg-custom-hero py-32 px-2 flex flex-col justify-center items-center space-y-6 relative z-0 sm:py-52">
            <p className="text-50 text-xl lg:text-2xl text-blue-500 text-center">De bedste leasing tilbud</p>
            <h1 className="text-50 text-5xl text-slate-900 font-bold text-center">Find din drømme bil</h1>

            <div className="flex flex-col p-4 w-full gap-2 lg:w-[950px] lg:flex-row lg:gap-0">

                <Select styles={customStyles} options={brandsOptions} value={selectedBrand} onChange={setSelectedBrand} isClearable isSearchable placeholder="Mærke" className="w-full lg:w-1/4" />
                <Select styles={customStyles} options={modelsOptions} value={selectedModel} onChange={setSelectedModel} isClearable isSearchable placeholder="Model" className="w-full lg:w-1/4" isDisabled={!selectedBrand} />
                <Select styles={customStyles} options={gearTypeOptions} value={selectedGearType} onChange={setSelectedGearType} isClearable isSearchable placeholder="Gearkasse" className="w-full lg:w-1/4" />
                <Select styles={customStyles} options={fuelTypeOptions} value={selectedFuelType} onChange={setSelectedFuelType} isClearable isSearchable placeholder="Brændstof" className="w-full lg:w-1/4" />
                <div className="flex flex-col gap-3 w-full lg:w-1/5 lg:ml-3 lg:flex-row lg:items-center lg:gap-0">
                    <button className="w-full bg-blue-500 text-white mt-4 min-h-[60px] rounded p-2 lg:mt-0 lg:min-h-[54px] ease-in-out transition hover:bg-blue-400"
                        onClick={searchCars}>Søg i biler</button>
                    <Link href="/dashboard/biler/opret" className="border-button w-full min-h-[60px] flex items-center justify-center rounded p-2 lg:hidden">
                        Opret annonce
                    </Link>
                </div>

            </div>
            {heroImage && <Image priority={true} src={heroImage} alt="Car" className="w-full h-auto absolute -bottom-12 sm:-bottom-28 max-w-4xl fade-in fade-in-visible sm:w-3/4" unoptimized />}
        </div>
    );
}
