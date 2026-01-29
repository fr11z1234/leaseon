'use client';

import { userStore } from "@/stores/UserStore";
import Head from "next/head";
import Select from 'react-select';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { carStore } from "@/stores/CarStore";
import Link from "next/link";
import EventEmitter from "@/EventEmitter";
import { useRouter } from "next/navigation";
import LoaderDark from "@/components/LoaderDark";

export default function () {

    const router = useRouter();
    const allEquipment = carStore((s) => s.equipment);
    const listing = userStore((state) => state.listing);
    const brands = carStore((state) => state.brands);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null as null | number);
    const [selectedBrand, setSelectedBrand] = useState(null as any);
    const [selectedFiles, setSelectedFiles] = useState([] as any[]);
    const [selectedPreviews, setSelectedPreviews] = useState([] as any[]);

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const internalListing = { ...listing } as any;
        internalListing.brand = internalListing.brand_name;
        internalListing.images = []
        selectedFiles.forEach(file => {
            internalListing.images.push(file);
        });
        internalListing.primaryImageIndex = primaryImageIndex;

        try {

            const res = await userStore.getState().createListing(internalListing);
            if (res) {
                EventEmitter.emit('notify', 'Annonce oprettet');
                router.push('/dashboard/biler');
            } else {
                EventEmitter.emit('notify', 'Der er sket en fejl, prøv igen');
            }
        } catch (error) {
            EventEmitter.emit('notify', 'Der er sket en fejl, prøv igen');
        }
    }

    useEffect(() => {
        carStore.getState().fetchBrands(true);
        carStore.getState().fetchEquipment();
        userStore.getState().checkAuth().then((isLoggedIn) => {
            if (!isLoggedIn) {
                router.push('/dashboard');
            }
        });
    }, [])

    const handleBrandChange = async (option: any) => {
        await userStore.setState({ listing: { ...listing, brand_name: option.value, brand_id: option.id } });
        setSelectedBrand(option);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files ?? null;
        userStore.setState({ listing: { ...listing, [name]: files ? files[0] : value } });
    };

    const handleEquipmentChange = (equipment_id: any) => {

        userStore.setState({
            listing: {
                ...listing, equipment: listing.equipment.includes(equipment_id)
                    ? listing.equipment.filter(id => id != equipment_id)
                    : [...listing.equipment, equipment_id]
            }
        });
    }

    const handleRemovePreview = (index: number) => {
        const newPreviews = [...selectedPreviews];
        const newSelectedFiles = [...selectedFiles];

        // Clean up memory for the removed preview URL
        URL.revokeObjectURL(newPreviews[index].url);

        // Remove the preview and the file at the specified index
        newPreviews.splice(index, 1);
        newSelectedFiles.splice(index, 1);

        // Update state
        setSelectedPreviews(newPreviews);
        setSelectedFiles(newSelectedFiles);
    };

    const handleFileSelect = (event: any) => {
        const files = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles, ...files]); // Update this to include the actual files selected

        const filePreviews = files.map((file: any) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setSelectedPreviews(prev => [...prev, ...filePreviews]);
    };

    const handleRadioChange = (event: any) => {
        userStore.setState({ listing: { ...listing, instant_takeover: Number(event.target.value) } });
    };

    // Fill with test data for development
    const fillTestData = () => {
        const testBrand = brands.length > 0 ? brands[Math.floor(Math.random() * brands.length)] : null;
        if (testBrand) {
            setSelectedBrand(testBrand);
        }
        
        const testData = {
            type: 'Personbil',
            brand_name: testBrand?.value || 'BMW',
            brand_id: testBrand?.id || 1,
            model: 'M4',
            variant: 'Competition',
            form: 'Coupe',
            model_year: 2023,
            fuel_type: 'Benzin',
            transmission_type: 'Automatisk',
            horsepower: 510,
            description: 'Fantastisk bil i perfekt stand. Fuldt serviceret hos BMW. Alle services overholdt. Bilen har alt udstyr inkl. M Driver\'s Package.',
            service_book: 'Ja',
            km_status: '25000',
            condition_status: 'Som Ny',
            payment: 150000,
            month_payment: 8500,
            restvalue: 450000,
            discount: 25000,
            lease_period: 24,
            leasing_type: 'Privat',
            instant_takeover: 1,
            be_listed: 1,
            equipment: allEquipment.slice(0, 8).map(e => e.equipment_id),
        };
        
        userStore.setState({ listing: { ...listing, ...testData } });
    };


    return (
        <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen pt-24 sm:pt-32 overflow-x-hidden">

            <Head>
                <title>Leaseon.dk - Opret annonce</title>
                <meta name="description" content={`Opret en leasingovertagelses annonce som privatperson på - leaseon.dk`} />
            </Head>

            <form className="w-full flex-col flex justify-center items-center gap-8 px-2" onSubmit={handleFormSubmit}>
                {/* Dev Test Button */}
                {process.env.NODE_ENV === 'development' && (
                    <div className='flex flex-col w-full max-w-[800px] items-end'>
                        <button 
                            type="button" 
                            onClick={fillTestData}
                            className='bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition'
                        >
                            🧪 Udfyld testdata
                        </button>
                    </div>
                )}
                
                {/* Biloplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border'>
                    <div className=" w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Bil Oplysninger</h1>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="type">Type Bil*</label>
                            <select
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="type"
                                name="type"
                                value={listing.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Personbil">Personbil</option>
                                <option value="Varebil">Varebil</option>
                            </select>
                        </div>
                        <div className='flex relative flex-col w-full justify-start items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="brand_id">Bilmærke*</label>
                            <Select
                                id="brand_id"
                                name="brand_id"
                                options={brands}
                                value={selectedBrand}
                                onChange={handleBrandChange}
                                isClearable
                                isSearchable
                                placeholder="Vælg Bilmærke"
                                className="w-full sm:min-w-[400px] max-w-[500px]"
                            />
                            {brands.length === 0 && (
                                <div className="absolute right-[-35px] top-1.5">
                                    <LoaderDark />
                                </div>
                            )}
                        </div>


                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="model">Model *</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="text" id="model" name="model" placeholder="Eks. C300, M4, Q5" value={listing.model || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="model_year">Variant*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="text" id="variant" name="variant" placeholder="Eks. AMG-Line, S-Line, M-Sport" value={listing.variant || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="form">Form*</label>
                            <select
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="form"
                                name="form"
                                value={listing.form || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Sedan">Sedan</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="SUV">SUV</option>
                                <option value="Coupe">Coupe</option>
                                <option value="Stationcar">Stationcar</option>
                                <option value="Cabriolet">Cabriolet</option>
                                <option value="Crossover">Crossover</option>
                                <option value="Van">Van</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="model_year">Årgang*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="model_year" name="model_year" placeholder="Indtast årgang..." value={listing.model_year || ''} onChange={handleInputChange} min="1000" max="9999" />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="fuel_type">Brændstof*</label>
                            <select
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="fuel_type"
                                name="fuel_type"
                                value={listing.fuel_type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Benzin">Benzin</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Elektrisk">Elektrisk</option>
                                <option value="Hybrid - Benzin">Hybrid - Benzin</option>
                                <option value="Hybrid - Diesel">Hybrid - Diesel</option>
                                <option value="Plug-in Benzin">Plug-in Benzin</option>
                                <option value="Plug-in Diesel">Plug-in Diesel</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="transmission_type">Gearkasse Type*</label>
                            <select
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="transmission_type"
                                name="transmission_type"
                                value={listing.transmission_type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Manuelt">Manuel</option>
                                <option value="Automatisk">Automatisk</option>
                            </select>
                        </div>


                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="horsepower">Hestekræfter*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="horsepower" name="horsepower" placeholder="Antal Hestekræfter..." value={listing.horsepower || ''} onChange={handleInputChange} min="0" max="1000" />
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="description">Beskrivelse*</label>
                            <textarea style={{ minHeight: '200px' }} className='input-own w-full sm:min-w-[400px] max-w-[500px] m-h-[500px] p-2' id="description" name="description" placeholder="Skriv lidt om bilen eller aftalen..." value={listing.description || ''} onChange={handleInputChange} />
                        </div>


                    </div>
                </div>
                {/* Biloplysninger slut */}





                {/* Equipment Section */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border'>
                    <div className="py-12 w-full flex flex-col px-8 sm:px-20 justify-between gap-6">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Ekstra Udstyr</h1>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center flex-wrap'>
                            {allEquipment.length == 0 && (
                                <div className="ml-auto mr-auto">
                                    <LoaderDark />
                                </div>
                            )}
                            {allEquipment.map(equipment => (
                                <div className='flex flex-row max-w-1/2 mb-4 sm:w-1/3 sm:mb-2' key={equipment.equipment_id}>
                                    <label>
                                        <input
                                            className='mr-2'
                                            type="checkbox"
                                            checked={listing.equipment.includes(equipment.equipment_id)}
                                            onChange={() => handleEquipmentChange(equipment.equipment_id)}
                                        />
                                        {equipment.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Bilens Stand start */}
                <div className='flex flex-col w-full sm:max-w-[800px] sm:items-center sm:justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-8 justify-between gap-6 sm:px-20">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Bilens Tilstand</h1>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="service_book">Services Bog*</label>
                            <select
                                required
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="service_book"
                                name="service_book"
                                value={listing.service_book || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Ja">Ja</option>
                                <option value="Nej">Nej</option>
                                <option value="Delvist">Delvist</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="kms_status">Kilometerstand *</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="km_status" name="km_status" placeholder="Antal Kørte km..." value={listing.km_status || ''} onChange={handleInputChange} />
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="condition_status">Bilens Stand*</label>
                            <select
                                required
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="condition_status"
                                name="condition_status"
                                value={listing.condition_status || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Helt Ny">Helt Ny</option>
                                <option value="Som Ny">Som Ny</option>
                                <option value="God">God</option>
                                <option value="Okay">Okay</option>
                                <option value="Slidt">Slidt</option>
                                <option value="Dårlig">Dårlig</option>
                                <option value="Totalt Skadet">Totalt Skadet</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* Bilens stand slut */}



                {/* Image Upload and Primary Image Selection Section */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border'>
                    <div className="py-12 w-full flex flex-col px-8 justify-between gap-3 sm:px-20">
                        <h1 className='text-2xl text-blue-500 font-medium'>Billeder af Bilen</h1>
                        <p className='text-md mb-6 text-gray-400 font-medium'>Klik på billedet du vil have skal vises først.</p>
                        <div className="flex flex-wrap -m-1 md:-m-2">

                            {/* Displaying image previews */}
                            {selectedPreviews.map((preview, index) => (
                                <div key={index} className="flex flex-wrap w-1/2 md:w-1/3 relative">
                                    <div className="w-full p-1 md:p-2 position-relative">
                                        <img
                                            alt={`Preview ${preview.name}`}
                                            className={`block w-full h-full object-cover rounded-lg ${index === primaryImageIndex ? 'border-blue-700 border-2' : ''} transition ease-in-out`}
                                            src={preview.url}
                                            onClick={() => setPrimaryImageIndex(index)}
                                            style={{
                                                cursor: 'pointer',
                                                opacity: index === primaryImageIndex ? '0.7' : '1',
                                                backgroundColor: index === primaryImageIndex ? 'rgba(0, 115, 230, 0.3)' : 'transparent',
                                            }}
                                        />
                                        <button type="button" onClick={() => handleRemovePreview(index)} className="absolute top-0 right-0 bg-blue-500/80 text-white p-1 m-2 rounded px-2 transition ease-in-out hover:opacity-70">Fjern</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input required type="file" multiple onChange={handleFileSelect} className="mb-4 bg-blue-500/10 p-5 border-2 border-dashed border-blue-500 rounded-md cursor-pointer transition ease-in-out hover:opacity-70" />
                    </div>
                </div>





                {/* Betalings Oplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-8 justify-between gap-6 sm:px-20">
                        <h1 className='text-2xl text-blue-500 font-medium'>Prisoplysninger Inkl. Moms</h1>
                        <p className='text-gray-400 text-xs -mt-4 mb-6'>Udbetalingen skal skrives som den står på aftalen, ikke med din præmie trukket fra. <br></br><br></br> <b>Restværdi er eksl. moms</b></p>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="payment">Udbetaling DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="payment" name="payment" placeholder="Den fulde udbetaling inkl moms." value={listing.payment || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="month_payment">Mnd Ydelse DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="month_payment" name="month_payment" placeholder="Mnd. Ydelse inkl moms." value={listing.month_payment || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="restvalue">Restværdi DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="restvalue" name="restvalue" placeholder="Restværdien Eksl Moms" value={listing.restvalue || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="discount">Præmie DKK*💸 </label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="discount" name="discount" placeholder="Beløbet du er villig til at betale for overtagelse" value={listing.discount || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="lease_period">Leasing Periode i mnd.</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' required type="number" id="lease_period" name="lease_period" placeholder="eks 12 mnd." value={listing.lease_period || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="condition_status">Leasing Type*</label>
                            <select
                                required
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="leasing_type"
                                name="leasing_type"
                                value={listing.leasing_type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Privat">Privat</option>
                                <option value="Flex">Flex</option>
                                <option value="Erhverv">Erhverv</option>
                                <option value="Operationel">Operationel (service leasing)</option>
                                <option value="Finansiel">Finansiel</option>
                                <option value="Split">Split</option>
                                <option value="Sæson">Sæson</option>
                            </select>
                        </div>
                        {/* Instant Takeover Radio Buttons */}
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center mt-4'>
                            <label className='w-[400px]'>Kan bilen overtages øjeblikkeligt ?</label>
                            <div className='flex flex-row w-full items-center justify-end gap-4'>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_yes">Ja</label>
                                    <input
                                        required
                                        type="radio"
                                        id="instant_takeover_yes"
                                        name="instant_takeover"
                                        value="1"
                                        checked={listing.instant_takeover === 1} // Ensure this compares to 1, not true
                                        onChange={handleRadioChange}
                                    />
                                </div>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_no">Nej</label>
                                    <input
                                        required
                                        type="radio"
                                        id="instant_takeover_no"
                                        name="instant_takeover"
                                        value="0"
                                        checked={listing.instant_takeover === 0} // Ensure this compares to 0, not false
                                        onChange={handleRadioChange}
                                    />
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
                {/* Betalings Oplysninger slut */}

                {/* Form Submission Section */}
                <div className='flex flex-row w-full max-w-[800px] items-center justify-end bg-white h-auto rounded-lg border-gray-200 border p-6 mb-12 sticky bottom-0'>
                    <div className='flex flex-row gap-4'>
                        <Link href="/dashboard/biler">
                            <button className='border-button h-full text-red-500'>Annuller</button>
                        </Link>
                        <button className='primary-button' type="submit">Opret annonce</button>
                    </div>
                </div>
            </form>
        </div>
    )
}