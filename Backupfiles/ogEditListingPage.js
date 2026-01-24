import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa'; // FaStar for filled star, FaRegStar for outline star




const EditListingPage = () => {
    const [listing, setListing] = useState({
        equipment: [],
        type: '',
        model: '',
        variant: '',
        form: '',
        model_year: '',
        fuel_type: '',
        horsepower: '',
        instant_takeover: 0, // Default to 'No'
        be_listed: 1, // Assuming '1' for true/listed and '0' for false/not listed
        images: [],
    });
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [allEquipment, setAllEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { listingId } = useParams();
    const navigate = useNavigate();
    const cardStyle = listing.be_listed === 0 ? "text-red-500" : "text-green-500";
    const bgstyle = listing.be_listed === 0 ? "bg-red-200" : "bg-green-100";
    const [selectedPreviews, setSelectedPreviews] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null);
    const [primaryImagePath, setPrimaryImagePath] = useState('');
    const handleSetPrimaryImagePath = (imagePath) => {
        setPrimaryImagePath(imagePath); // Set the path of the primary image
        setPrimaryImageIndex(null); // Clear primary image selection from the newly uploaded images
    };

    const handleSetPrimaryImageIndex = (index) => {
        setPrimaryImageIndex(index); // Set the index of the primary image in the new uploads
        setPrimaryImagePath(''); // Clear primary image selection from the already uploaded images
    };


    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:5000/equipment')
            .then(response => response.json())
            .then(allEquipmentData => {
                const sortedEquipment = allEquipmentData.sort((a, b) => a.name.localeCompare(b.name));
                setAllEquipment(sortedEquipment);

                fetch(`http://localhost:5000/carlistings/${listingId}`)
                    .then(response => response.json())
                    .then(data => {
                        const equipmentIds = data.equipment.map(name =>
                            allEquipmentData.find(equip => equip.name === name)?.equipment_id
                        ).filter(id => id !== undefined);

                        setListing({ ...data, images: data.images || [], equipment: equipmentIds, instant_takeover: data.instant_takeover });
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Fetching listing details error:', error);
                        setError('Failed to load listing details.');
                        setLoading(false);
                    });
            })
            .catch(error => {
                console.error('Fetching all equipment error:', error);
                setError('Failed to load equipment data.');
                setLoading(false);
            });
    }, [listingId, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setListing({ ...listing, [name]: value });
    };

    const handleEquipmentChange = (equipmentId) => {
        setListing(prevListing => {
            const newEquipment = prevListing.equipment.includes(equipmentId)
                ? prevListing.equipment.filter(id => id !== equipmentId)
                : [...prevListing.equipment, equipmentId];
            return { ...prevListing, equipment: newEquipment };
        });
    };

    const handleRadioChange = (event) => {
        setListing({ ...listing, instant_takeover: Number(event.target.value) });
    };

    const toggleListingStatus = () => {
        setListing({ ...listing, be_listed: listing.be_listed ? 0 : 1 });
    };






    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files); // Update this to include the actual files selected

        const filePreviews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setSelectedPreviews(prev => [...prev, ...filePreviews]);
    };


    const handleRemovePreview = (index) => {
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


    const handleRemoveImage = (imagePath) => {
        // Remove image from current state
        setListing(prevListing => ({
            ...prevListing,
            images: prevListing.images.filter(img => img !== imagePath)
        }));
        // Add to imagesToRemove state for backend processing
        setImagesToRemove(prev => [...prev, imagePath]);
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('userToken');

        // Initialize FormData for image upload if there are new images to upload
        let imageUploadFormData = null;
        if (selectedFiles.length > 0) {
            imageUploadFormData = new FormData();
            selectedFiles.forEach((file, index) => {
                imageUploadFormData.append('images', file);
                // If this file is the primary image, indicate that in the FormData
                if (index === primaryImageIndex) {
                    imageUploadFormData.append('primary', file.name);
                }
            });
        }

        try {
            // Attempt the upload if there are selected files
            if (imageUploadFormData) {
                const uploadResponse = await fetch(`http://localhost:5000/upload-images/${listingId}`, {
                    method: 'POST',
                    body: imageUploadFormData,
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.message || 'Failed to upload images.');
                }
            }

            // Prepare the data for updating the listing, including the primaryImagePath if an existing image was set as primary
            const updateData = {
                ...listing,
                instant_takeover: listing.instant_takeover ? 1 : 0,
                imagesToRemove,
                ...(primaryImagePath && { existingPrimary: primaryImagePath }) // Include existingPrimary only if primaryImagePath is set
            };

            const response = await fetch(`http://localhost:5000/edit-listing/${listingId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update the listing.');
            }

            window.mitt.emit('notify','Opslaget er opdateret!');
            navigate('/dashboard'); // Or handle the successful update in another way
        } catch (error) {
            console.error('Error during form submission:', error);
            setError(error.message || 'An error occurred.');
        } finally {
            // Reset selections and previews after handling the form submission
            setImagesToRemove([]);
            setSelectedFiles([]);
            setSelectedPreviews([]);
            setPrimaryImageIndex(null);
            setPrimaryImagePath(''); // Reset primaryImagePath state
        }
    };









    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen sm:pt-32">
            <form className="w-full flex-col flex justify-center items-center gap-8" onSubmit={handleFormSubmit}>

                {/* Biloplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-20 justify-between gap-6">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Bil Oplysninger</h1>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="type">Type Bil*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
                                id="type"
                                name="type"
                                value={listing.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Personbil">Personbil</option>
                                <option value="Varebil">Varebil</option>
                            </select>
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="model">Model *</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="text" id="model" name="model" value={listing.model || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="model_year">Variant*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="text" id="variant" name="variant" value={listing.variant || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="form">Form*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
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
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="model_year">Årgang*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="model_year" name="model_year" value={listing.model_year || ''} onChange={handleInputChange} min="1000" max="9999" />
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="fuel_type">Brændstof*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
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

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="transmission_type">Gearkasse Type*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
                                id="transmission_type"
                                name="transmission_type"
                                value={listing.transmission_type || ''}
                                onChange={handleInputChange}
                            >
                                <option value="Manuel">Manuel</option>
                                <option value="Automatisk">Automatisk</option>
                            </select>
                        </div>

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="horsepower">Hestekræfter*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="horsepower" name="horsepower" value={listing.horsepower || ''} onChange={handleInputChange} min="0" max="1000" />
                        </div>

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="description">Beskrivelse*</label>
                            <textarea style={{ minHeight: '200px' }} className='input-own w-full min-w-[400px] max-w-[500px] m-h-[500px] p-2' type="text" id="description" name="description" value={listing.description || ''} onChange={handleInputChange} />
                        </div>


                    </div>
                </div>
                {/* Biloplysninger slut */}


                {/* Udstyr start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-20 justify-between gap-6">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Ekstra Udstyr</h1>
                        <div className='flex flex-row w-full justify-between items-center flex-wrap'>
                            {
                                allEquipment.map(equipment => (
                                    <div className='flex flex-row w-1/3 mb-2' key={equipment.equipment_id}>
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
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* udstyr slut */}


                {/* Bilens Stand start */}
                <div className='flex flex-col w-full sm:max-w-[800px] sm:items-center sm:justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-20 justify-between gap-6">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Bilens Tilstand</h1>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="service_book">Service Bog*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
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

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="kms_status">Kilometerstand *</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="km_status" name="km_status" value={listing.km_status || ''} onChange={handleInputChange} />
                        </div>

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="condition_status">Service Bog*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
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

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="condition_status">Leasing Type*</label>
                            <select
                                className='input-own w-full min-w-[400px] max-w-[500px]'
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

                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="lease_period">Leasing Periode i mnd.</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="lease_period" name="lease_period" value={listing.lease_period || ''} onChange={handleInputChange} />
                        </div>

                        {/* Instant Takeover Radio Buttons */}
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label className='w-[400px]'>Kan bilen overtages øjeblikkeligt ?</label>
                            <div className='flex flex-row w-full items-center justify-end gap-4'>
                                <div className='flex flex-row w-fit items-center justify-end'>
                                    <label className='mr-2' htmlFor="instant_takeover_yes">Ja</label>
                                    <input
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
                {/* Bilens stand slut */}


                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-20 justify-between gap-6">
                        <div className="flex flex-wrap -m-1 md:-m-2">
                            {listing.images.map((imagePath, index) => (
                                <div key={index} className="flex flex-wrap w-1/2 md:w-1/3 relative">
                                    <div className="w-full p-1 md:p-2 position-relative">
                                        <img alt={`Listing Image ${index}`} className="block w-full h-full object-cover rounded-lg" src={`http://localhost:5000/${imagePath}`} />
                                        <button type="button" onClick={() => handleRemoveImage(imagePath)} className="absolute top-0 right-0 bg-red-500/80 text-white m-2 rounded px-2 transition ease-in-out hover:opacity-70">X</button>
                                        <div className="absolute bottom-0 left-0 p-1 cursor-pointer" onClick={() => handleSetPrimaryImagePath(imagePath)}>
                                            {primaryImagePath === imagePath ? <FaStar color="gold" size="20px" /> : <FaRegStar color="gray" size="20px" />}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Displaying image previews */}
                            {selectedPreviews.map((preview, index) => (
                                <div key={index} className="flex flex-wrap w-1/2 md:w-1/3 relative">
                                    <div className="w-full p-1 md:p-2 position-relative">
                                        <img alt={`Preview ${preview.name}`} className="block w-full h-full object-cover rounded-lg" src={preview.url} />
                                        <button type="button" onClick={() => handleRemovePreview(index)} className="absolute top-0 right-0 bg-blue-500/80 text-white p-1 m-2 rounded px-2 transition ease-in-out hover:opacity-70">Fjern</button>
                                        <div className="absolute bottom-0 left-0 p-1 cursor-pointer" onClick={() => handleSetPrimaryImageIndex(index)}>
                                            {primaryImageIndex === index ? <FaStar color="gold" size="20px" /> : <FaRegStar color="gray" size="20px" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple onChange={handleFileSelect} className="mb-4" />
                    </div>
                </div>



                {/* Betalings Oplysninger start */}
                <div className='flex flex-col w-full max-w-[800px] items-center justify-center bg-white h-auto rounded-lg border-gray-200 border '>
                    <div className="py-12 w-full flex flex-col px-20 justify-between gap-6">
                        <h1 className='text-2xl mb-6 text-blue-500 font-medium'>Prisoplysninger Inkl. Moms</h1>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="payment">Udbetaling DKK*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="payment" name="payment" value={listing.payment || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="month_payment">Mnd Ydelse DKK*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="month_payment" name="month_payment" value={listing.month_payment || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-row w-full justify-between items-center'>
                            <label htmlFor="restvalue">Restværdi Eksl Moms DKK*</label>
                            <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="restvalue" name="restvalue" value={listing.restvalue || ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='flex flex-row w-full justify-between items-center'>
                                <label htmlFor="discount">Præmie DKK*💸 </label>
                                <input className='input-own w-full min-w-[400px] max-w-[500px]' type="number" id="discount" name="discount" value={listing.discount || ''} onChange={handleInputChange} />
                            </div>
                            <div className='flex flex-row w-full justify-end items-center'>
                                <p className='text-gray-400 text-xs'>Dette er beløbet du er villig til at betale for overtagelse af din leasing aftale</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Betalings Oplysninger slut */}
                <div className='flex flex-row w-full max-w-[800px] items-center justify-between bg-white h-auto rounded-lg border-gray-200 border p-6 mb-12 sticky bottom-0'>
                    <button type="button" onClick={toggleListingStatus} className={`${cardStyle} ${bgstyle} py-3 px-4 hover:opacity-70`}>
                        {listing.be_listed ? 'Bilen er Tilgængelig' : 'Bilen Er Solgt'}
                    </button>
                    <div className='flex flex-row gap-4'>
                        <Link to="/dashboard">
                            <button className='border-button h-full text-red-500'>Annuller</button>
                        </Link>
                        <button className='primary-button' type="submit">Gem Ændringer</button>
                    </div>
                </div>

            </form >
        </div >
    );
};

export default EditListingPage;


{/* Equipment checkboxes */ }
