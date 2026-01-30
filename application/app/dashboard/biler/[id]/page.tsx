'use client';

import { userStore } from "@/stores/UserStore";
import Head from "next/head";
import Select from 'react-select';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DefaultListing from "@/types/Listing";
import { useRouter } from "next/navigation";
import { Equipment } from "@/types/Equipment";
import Link from "next/link";
import EventEmitter from "@/EventEmitter";
import { carStore } from "@/stores/CarStore";
import loadingLottie from '@/lottie/loading.json';
import { Player } from '@lottiefiles/react-lottie-player';
import { eq } from "lodash";
import { getImageUrl } from "@/utils/img";
import Loader from "@/components/Loader";

// Helper function to format number with thousand separators
const formatNumber = (value: string | number): string => {
    if (!value && value !== 0) return '';
    const num = typeof value === 'string' ? value.replace(/\./g, '') : value.toString();
    const parsed = parseInt(num, 10);
    if (isNaN(parsed)) return '';
    return parsed.toLocaleString('da-DK');
};

// Helper function to parse formatted number back to raw number
const parseFormattedNumber = (value: string): string => {
    return value.replace(/\./g, '');
};

type Props = {
    params: { id: number };
};

export default function ({ params }: Props) {

    const fetching = userStore((s) => s.fetching);
    const listing = userStore((s) => s.listing);
    const allEquipment = carStore((s) => s.equipment);
    const brands = carStore((s) => s.brands);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null as null | number);
    const [primaryImagePath, setPrimaryImagePath] = useState('');
    const [imagesToRemove, setImagesToRemove] = useState([] as string[]);
    const [selectedFiles, setSelectedFiles] = useState([] as any[]);
    const [selectedPreviews, setSelectedPreviews] = useState([] as any[]);
    const [selectedBrand, setSelectedBrand] = useState(null as any);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        userStore.setState({ listing: DefaultListing() });
        carStore.getState().fetchEquipment();
        carStore.getState().fetchBrands(true);
        userStore.getState().checkAuth().then(async (isLoggedIn) => {
            if (isLoggedIn) {
                await userStore.getState().fetchListing(params.id);
                const fetchedListing = userStore.getState().listing;
                setPrimaryImagePath(fetchedListing?.primaryImage?.path || '');
                setPrimaryImageIndex(fetchedListing?.primaryImage?.index || null);

                // Set selected brand based on listing data
                const allBrands = carStore.getState().brands;
                const currentBrand = allBrands.find((b: any) => b.id === fetchedListing?.brand_id);
                if (currentBrand) {
                    setSelectedBrand(currentBrand);
                }
            } else {
                router.push('/dashboard');
            }
        });
    }, [])

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const path = await userStore.getState().uploadImages(selectedFiles, listing.listing_id, primaryImageIndex);

        if (path) setPrimaryImagePath(path);

        const updateData = {
            ...listing,
            instant_takeover: listing.instant_takeover ? 1 : 0,
            imagesToRemove,
            ...(primaryImagePath && { existingPrimary: primaryImagePath }) // Include existingPrimary only if primaryImagePath is set
        };

        const result = await userStore.getState().updateListing(updateData);

        if (result) {
            EventEmitter.emit('notify', 'Dine ændringer er blevet gemt!');
            router.push('/dashboard/biler');
        } else {
            setIsSubmitting(false);
            EventEmitter.emit('notify', 'Der skete en fejl under gemning af dine ændringer, prøv igen eller kontakt os for hjælp.');
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files ?? null;
        userStore.setState({ listing: { ...listing, [name]: files ? files[0] : value } });
    };

    // Handler for formatted number inputs (with thousand separators)
    const handleFormattedNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const rawValue = parseFormattedNumber(value);
        userStore.setState({ listing: { ...listing, [name]: rawValue } });
    };

    // Prevent scroll from changing number input values
    const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
        e.currentTarget.blur();
    };

    const handleBrandChange = async (option: any) => {
        if (option) {
            await userStore.setState({ listing: { ...listing, brand_name: option.value, brand_id: option.id } });
            setSelectedBrand(option);
        } else {
            setSelectedBrand(null);
        }
    };

    const handleEquipmentChange = async (equipment_id: number) => {
        // Toggle equipment in the listing's equipment array
        const is_selected = listing.equipment.includes(equipment_id);
        let res = listing.equipment;
        if (is_selected) {
            res = res.filter((e: number) => e !== equipment_id); // Remove if already selected
        } else {
            res.push(equipment_id); // Add if not selected
        }
        await userStore.setState({ listing: { ...listing, equipment: res } });
    }

    const handleSetPrimaryImagePath = (imagePath: string) => {
        setPrimaryImagePath(imagePath); // Set the path of the primary image
        setPrimaryImageIndex(null); // Clear primary image selection from the newly uploaded images
    };

    const handleSetPrimaryImageIndex = (index: number) => {
        setPrimaryImageIndex(index); // Set the index of the primary image in the new uploads
        setPrimaryImagePath(''); // Clear primary image selection from the already uploaded images
    };

    const handleRemoveImage = (imagePath: string) => {
        // Remove image from current state
        userStore.setState({ listing: { ...listing, images: listing.images.filter(img => img !== imagePath) } });
        // Add to imagesToRemove state for backend processing
        setImagesToRemove(prev => [...prev, imagePath]);
    };

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
        const MAX_SIZE = 2.5 * 1024 * 1024; // 2.5 MB in bytes
        const files = Array.from(event.target.files) as File[]; // Convert FileList to an array
        const corrected = files.filter((f: File) => f.size <= MAX_SIZE); // Filter files <= 2.5 MB
        const aboveLimit = files.filter((f: File) => f.size > MAX_SIZE); // Filter files <= 2.5 MB
        setSelectedFiles([...selectedFiles, ...corrected]); // Update this to include the actual files selected
        if (aboveLimit) {
            EventEmitter.emit('notify', 'Nogle af dine billeder er blevet fjernet da de er over 2,5MB.');
        }

        const filePreviews = corrected.map((file: any) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setSelectedPreviews(prev => [...prev, ...filePreviews]);
    };

    const handleRadioChange = (event: any) => {
        userStore.setState({ listing: { ...listing, instant_takeover: Number(event.target.value) } });
    };


    const toggleListingStatus = (event: any) => {
        userStore.setState({ listing: { ...listing, be_listed: Number(event.target.value) } });
    };

    const handleDeleteListing = async () => {
        const confirmDelete = window.confirm('Er du sikker på du vil slette denne annonce?');
        if (!confirmDelete) return;

        try {
            const response = await userStore.getState().deleteListing(listing.listing_id);

            if (!response) {
                EventEmitter.emit('notify', 'Der skete en fejl under sletning af opslaget, prøv igen eller kontakt os for hjælp.');
                return false;
            }

            EventEmitter.emit('notify', 'Opslaget er blevet slettet!');
            router.push('/dashboard/biler'); // Navigate back to dashboard or the desired page after deletion
        } catch (error) {
            console.error('Error deleting listing:', error);
            EventEmitter.emit('notify', 'Der skete en fejl under sletning af opslaget, prøv igen eller kontakt os for hjælp.');
        }
    };

    if (fetching || !listing.listing_id) {
        return (

            <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen pt-24 sm:pt-32 overflow-x-hidden">
                <Player
                    autoplay
                    loop
                    src={loadingLottie}
                    style={{ height: '180px', width: '300px' }}
                >
                </Player>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen pt-24 sm:pt-32 overflow-x-hidden">
            <form id="edit-listing-form" className="w-full flex-col flex justify-center items-center gap-8 px-2" onSubmit={handleFormSubmit}>
                <Head>
                    <title>Leaseon.dk - Rediger Annoncen for {listing.model} {listing.variant}</title>
                    <meta name="description" content={`Opret din konto på den eneste leasingannoncerings platform for private - leasingovertagelser - leaseon.dk`} />
                </Head>
                {/* Biloplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
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
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="model">Model *</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="model" name="model" value={listing.model || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="model_year">Variant*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="variant" name="variant" value={listing.variant || ''} onChange={handleInputChange} />
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
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="number" id="model_year" name="model_year" value={listing.model_year || ''} onChange={handleInputChange} onWheel={preventScrollChange} min="1000" max="9999" />
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
                                <option value="Manuelt">Manuelt</option>
                                <option value="Automatisk">Automatisk</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="horsepower">Hestekræfter*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="number" id="horsepower" name="horsepower" value={listing.horsepower || ''} onChange={handleInputChange} onWheel={preventScrollChange} min="0" max="1000" />
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="description">Beskrivelse*</label>
                            <textarea style={{ minHeight: '200px' }} className='input-own w-full sm:min-w-[400px] max-w-[500px] m-h-[500px] p-2' id="description" name="description" value={listing.description || ''} onChange={handleInputChange} />
                        </div>


                    </div>
                </div>
                {/* Biloplysninger slut */}


                {/* Udstyr start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Ekstra Udstyr</h1>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center flex-wrap'>
                            {
                                allEquipment.map((equipment: Equipment) => (
                                    <div className='flex flex-row max-w-1/2 mb-4 sm:w-1/3 sm:mb-2' key={equipment.equipment_id}>
                                        <label>
                                            <input
                                                className='mr-2'
                                                type="checkbox"
                                                checked={listing.equipment.some(equip => equip === equipment.equipment_id)}
                                                onChange={() => handleEquipmentChange(equipment.equipment_id)}
                                            />
                                            {equipment.name}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* udstyr slut */}


                {/* Bilens Stand start */}
                <div className='flex flex-col w-full sm:max-w-[800px] sm:items-center sm:justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Bilens Tilstand</h1>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="service_book">Service Bog*</label>
                            <select
                                className='input-own w-full sm:min-w-[400px] max-w-[500px]'
                                id="service_book"
                                name="service_book"
                                value={listing.service_book || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Ja">Ja</option>
                                <option value="Nej">Nej</option>
                                <option value="Devlist">Delvist</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="kms_status">Kilometerstand *</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="km_status" name="km_status" value={formatNumber(listing.km_status)} onChange={handleFormattedNumberChange} />
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="condition_status">Bilens Stand</label>
                            <select
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
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
                        <h1 className='text-2xl text-blue-500 font-medium'>Billeder af Bilen</h1>
                        <p className='text-md mb-6 text-gray-400 font-medium'>Klik på billedet du vil have skal vises først.</p>
                        <div className="flex flex-wrap -m-1 md:-m-2">
                            {/* Existing images */}
                            {listing.images.map((imagePath, index) => (
                                <div key={index} className="flex flex-wrap w-1/2 md:w-1/3 relative">
                                    <div className="w-full p-1 md:p-2 position-relative">
                                        <img
                                            alt={`Listing Image ${index}`}
                                            className={`block w-full h-full object-cover bg-blue-500 rounded-lg ${primaryImageIndex == null && (primaryImagePath == "" && listing?.primaryImage?.path == imagePath || imagePath === primaryImagePath) ? 'border-blue-700 border-2' : ''} transition ease-in-out`}
                                            src={getImageUrl(imagePath)}
                                            onClick={() => handleSetPrimaryImagePath(imagePath)}
                                            style={{
                                                cursor: 'pointer',
                                                opacity: primaryImageIndex == null && (primaryImagePath == "" && listing?.primaryImage?.path == imagePath || imagePath === primaryImagePath) ? '0.7' : '1',
                                                backgroundColor: primaryImageIndex == null && (primaryImagePath == "" && listing?.primaryImage?.path == imagePath || imagePath === primaryImagePath) ? 'rgba(0, 115, 230, 0.3)' : 'transparent',
                                            }}
                                        />
                                        <button type="button" onClick={() => handleRemoveImage(imagePath)} className="absolute top-0 right-0 bg-blue-500/80 text-white p-1 m-2 rounded px-2 transition ease-in-out opacity-70 hover:opacity-100">Fjern</button>
                                    </div>
                                </div>
                            ))}
                            {/* Newly uploaded image previews */}
                            {selectedPreviews.map((preview, index) => (
                                <div key={index} className="flex flex-wrap w-1/2 md:w-1/3 relative">
                                    <div className="w-full p-1 md:p-2 position-relative">
                                        <img
                                            alt={`Preview ${preview.name}`}
                                            className={`block w-full h-full object-cover rounded-lg ${index === primaryImageIndex ? 'border-blue-700 border-2' : ''} transition ease-in-out`}
                                            src={preview.url}
                                            onClick={() => handleSetPrimaryImageIndex(index)}
                                            style={{
                                                cursor: 'pointer',
                                                opacity: index === primaryImageIndex ? '0.7' : '1',
                                                backgroundColor: index === primaryImageIndex ? 'rgba(0, 115, 230, 0.3)' : 'transparent',
                                            }}
                                        />
                                        <button type="button" onClick={() => handleRemovePreview(index)} className="absolute top-0 right-0 bg-blue-500/80 text-white p-1 m-2 rounded px-2 transition ease-in-out opacity-70 hover:opacity-100">Fjern</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple onChange={handleFileSelect} className="mb-4 bg-blue-500/10 p-5 border-2 border-dashed border-blue-500 rounded-md cursor-pointer transition ease-in-out hover:opacity-70" />
                    </div>
                </div>



                {/* Betalings Oplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="w-full flex flex-col px-8 justify-between gap-6 py-12 sm:px-20">
                        <h1 className='text-2xl text-blue-500 font-medium'>Prisoplysninger Inkl. Moms</h1>
                        <p className='text-gray-400 text-xs -mt-4 mb-6'>Udbetalingen skal skrives som den står på aftalen, ikke med din præmie trukket fra.</p>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="payment">Udbetaling DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="payment" name="payment" value={formatNumber(listing.payment)} onChange={handleFormattedNumberChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="month_payment">Mnd Ydelse DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="month_payment" name="month_payment" value={formatNumber(listing.month_payment)} onChange={handleFormattedNumberChange} />
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="restvalue">Restværdi DKK*</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="restvalue" name="restvalue" value={formatNumber(listing.restvalue)} onChange={handleFormattedNumberChange} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                                <label htmlFor="discount">Præmie DKK*💸 </label>
                                <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="text" id="discount" name="discount" value={formatNumber(listing.discount)} onChange={handleFormattedNumberChange} />
                            </div>
                        </div>
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="condition_status">Leasing Type*</label>
                            <select
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

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label htmlFor="lease_period">Leasing Periode i mnd.</label>
                            <input className='input-own w-full sm:min-w-[400px] max-w-[500px]' type="number" id="lease_period" name="lease_period" value={listing.lease_period || ''} onChange={handleInputChange} onWheel={preventScrollChange} />
                        </div>

                        {/* Instant Takeover Radio Buttons */}
                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label className='w-[400px]'>Kan bilen overtages øjeblikkeligt ?</label>
                            <div className='flex flex-row w-full items-center justify-end gap-4'>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_yes">Ja</label>
                                    <input
                                        type="radio"
                                        id="instant_takeover_yes"
                                        name="instant_takeover"
                                        value="1"
                                        checked={listing.instant_takeover ? true : false} // Ensure this compares to 1, not true
                                        onChange={handleRadioChange}
                                    />
                                </div>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_no">Nej</label>
                                    <input
                                        type="radio"
                                        id="instant_takeover_no"
                                        name="instant_takeover"
                                        value="0"
                                        checked={!listing.instant_takeover ? false : true} // Ensure this compares to 0, not false
                                        onChange={handleRadioChange}
                                    />
                                </div>
                            </div >
                        </div>

                        <div className='flex flex-col w-full justify-start  items-start sm:flex-row sm:justify-between sm:items-center'>
                            <label className='w-[400px]'>Er bilen solgt ?</label>
                            <div className='flex flex-row w-full items-center justify-end gap-4'>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_no">Ja</label>
                                    <input
                                        type="radio"
                                        id="be_listed_no"
                                        name="be_listed"
                                        value="0"
                                        checked={!listing.be_listed ? false : true} // Ensure this compares to 0, not false
                                        onChange={toggleListingStatus}
                                    />
                                </div>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_yes">Nej</label>
                                    <input
                                        type="radio"
                                        id="be_listed_yes"
                                        name="be_listed"
                                        value="1"
                                        checked={listing.be_listed ? true : false} // Ensure this compares to 1, not true
                                        onChange={toggleListingStatus}
                                    />
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
                {/* Betalings Oplysninger slut */}

                {/* Spacer for fixed bottom bar */}
                <div className='h-24 sm:h-20'></div>

            </form >

            {/* Fixed bottom action bar */}
            <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50'>
                <div className='flex flex-col sm:flex-row-reverse w-full max-w-[800px] mx-auto items-center justify-between px-6 py-4 gap-2 sm:gap-4'>
                    <button
                        form="edit-listing-form"
                        className='primary-button w-full sm:w-fit text-white bg-blue-500 p-2 sm:p-4 rounded transition ease-in duration-100 hover:bg-blue-600 flex items-center justify-center gap-2 min-w-[180px]'
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader />
                                <span>Gemmer...</span>
                            </>
                        ) : (
                            'Gem Ændringer'
                        )}
                    </button>
                    <Link href="/dashboard/biler" className={`d-flex justify-center w-full sm:w-fit border-button text-red-500 p-2 sm:p-4 rounded transition ease-in duration-100 hover:opacity-30 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>Annuller</Link>
                    <div className='flex flex-row gap-2 sm:gap-4 justify-end flex-grow'>
                        <button type="button" className='delete-button w-[180px] text-red-500 p-2 sm:p-4 rounded transition ease-in duration-100' onClick={handleDeleteListing} disabled={isSubmitting}>
                            Slet Annoncen
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}