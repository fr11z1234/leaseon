import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ListingCard from './components/cards/ListingCard';
import useFadeInOnScroll from './components/Fadein.js';

const AllListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [filter, setFilter] = useState({
        brand: '',
        model: '',
    });
    const [maxPayment, setMaxPayment] = useState('');
    const [maxMonthlyPayment, setMaxMonthlyPayment] = useState('');
    const [maxKilometer, setMaxKilometer] = useState('');
    const [minDiscount, setMinDiscount] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [transmissionType, setTransmissionType] = useState('');
    const [carForm, setCarForm] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [showFilters, setShowFilters] = useState(false);



    const resetFilters = () => {
        setSelectedBrand(null); // Resets the selected brand
        setSelectedModel(null); // Resets the selected model
        setMaxPayment(''); // Resets the max payment input field
        setMaxMonthlyPayment(''); // Resets the max monthly payment input field
        setMaxKilometer(''); // Resets the max kilometer input field
        setMinDiscount(''); // Resets the min discount input field
        setFuelType(''); // Resets the fuel type selection
        setTransmissionType(''); // Resets the transmission type selection
        setCarForm(''); // Resets the car form selection
        setMaxYear('');
        setFilter({
            brand: '',
            model: '',
            fuel_type: '', // Resets the fuel type filter
            transmission_type: '', // Resets the transmission type filter
            form: '', // Resets the car form filter
            payment: '', // Resets the payment filter to its initial state
            month_payment: '', // Resets the monthly payment filter to its initial state
            km_status: '', // Resets the kilometer status filter to its initial state
            discount: '', // Resets the discount filter to its initial state
        });
        fetchListings({}); // Triggers a fetch to reload the listings with reset filters
    };


    const fetchListings = (currentFilters) => {
        setLoading(true);
        const queryParams = new URLSearchParams(currentFilters).toString();
        fetch(`http://localhost:5000/all-listings?${queryParams}`)
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching listings:', err);
                setLoading(false);
            });
    };





    useEffect(() => {
        fetch('http://localhost:5000/records')
            .then(res => res.json())
            .then(brandData => {
                const brandOptions = brandData.map(brand => ({
                    value: brand.brand_name,
                    label: brand.brand_name,
                }));
                setBrands(brandOptions);
            })
            .catch(err => console.error('Error fetching brands:', err));
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            setLoading(true);
            fetch(`http://localhost:5000/models-by-brand?brand=${encodeURIComponent(selectedBrand.value)}`)
                .then(res => res.json())
                .then(modelData => {
                    const modelOptions = modelData.map(model => ({
                        value: model,
                        label: model,
                    }));
                    setModels(modelOptions);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching models:', err);
                    setLoading(false);
                });
        } else {
            setModels([]);
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (Object.keys(filter).length > 0) {
            setLoading(true);
            const queryParams = new URLSearchParams(filter).toString();
            fetch(`http://localhost:5000/all-listings?${queryParams}`)
                .then(res => res.json())
                .then(data => {
                    setListings(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching listings:', err);
                    setLoading(false);
                });
        }
    }, [filter]); // Fetch only when filter changes

    const handleBrandChange = selectedOption => {
        setSelectedBrand(selectedOption);
        setSelectedModel(null); // Reset the selectedModel state
        setFilter(prev => ({ ...prev, brand: selectedOption ? selectedOption.value : '', model: '' }));
        setModels([]);
    };

    const handleModelChange = selectedOption => {
        setSelectedModel(selectedOption); // Update the selectedModel state
        setFilter(prev => ({ ...prev, model: selectedOption ? selectedOption.value : '' }));
    };

    const applyFilters = () => {
        setShowFilters(false); // Hide the filter section on mobile
        setFilter(prev => ({
            ...prev,
            payment: maxPayment,
            month_payment: maxMonthlyPayment,
            km_status: maxKilometer,
            discount: minDiscount,
            fuel_type: fuelType,
            transmission_type: transmissionType,
            form: carForm,
            model_year: maxYear,
        }));
    };
    useFadeInOnScroll(); // fade in effect
    return (
        <div className='w-full h-auto flex flex-col lg:flex-row items-center lg:items-start gap-6'>
            <div className={` ${showFilters ? 'block' : 'hidden'} md:block w-full lg:min-w-[330px] fade-in lg:w-fit sm:sticky sm:top-0`}>
                <div className="w-full flex gap-4 flex-col px-10 py-20 lg:h-full sm:min-h-[1000px]  bg-custom-background  lg:w-full sm:overflow-y-auto sm:px-6">
                    < h1 className="text-xl font-bold mb-0">Søg efter biler</h1>
                    <p className='-mt-3 text-blue-500'>{listings.length} Tilgængelige</p>

                    {/* Bil & Aftale Filtre START */}
                    <div className="flex flex-col gap-4 mt-4 ">
                        <p className='font-bold text-gray-400'>Bil & Teknik</p>
                        <Select
                            options={brands}
                            value={selectedBrand}
                            isClearable
                            isSearchable
                            placeholder="Mærke"
                            onChange={handleBrandChange}
                            className="w-full "
                        />
                        <Select
                            options={models}
                            value={selectedModel}
                            isClearable
                            isSearchable
                            placeholder="Model"
                            onChange={handleModelChange}
                            isDisabled={!selectedBrand}
                            className="w-full "
                        />

                        <Select
                            options={[{ value: 'Benzin', label: 'Benzin' }, { value: 'Diesel', label: 'Diesel' }, { value: 'hybrid - benzin', label: 'Hybrid - Benzin' }]}
                            value={fuelType ? { value: fuelType, label: fuelType } : null} // Correctly set value or null
                            onChange={(selectedOption) => setFuelType(selectedOption ? selectedOption.value : '')}
                            placeholder="Brændstofstype"
                            className="input-class"
                            isClearable
                        />

                        <Select
                            options={[{ value: 'automatisk', label: 'Automatisk' }, { value: 'manuel', label: 'Manuel' },]}
                            value={transmissionType ? { value: transmissionType, label: transmissionType } : null} // Correctly set value or null
                            onChange={(selectedOption) => setTransmissionType(selectedOption ? selectedOption.value : '')}
                            placeholder="Gearkasse"
                            className="input-class"
                            isClearable
                        />

                        <Select
                            options={[
                                { value: 'SUV', label: 'SUV' },
                                { value: 'Crossover', label: 'Crossover' },
                                { value: 'Coupe', label: 'Coupe' },
                                { value: 'Stationcar', label: 'Stationcar' },
                                { value: 'Hatchback', label: 'Hatchback' },
                                { value: 'Sedan', label: 'Sedan' },
                                { value: 'Van', label: 'Van' },
                                { value: 'Cabriolet', label: 'Cabriolet' }
                            ]}
                            value={carForm ? { value: carForm, label: carForm } : null} // Correctly set value or null
                            onChange={(selectedOption) => setCarForm(selectedOption ? selectedOption.value : '')}
                            placeholder="Bil form"
                            className="input-class"
                            isClearable
                        />
                        <input
                            type="number"
                            placeholder="Max Årgang"
                            value={maxYear}
                            onChange={(e) => setMaxYear(e.target.value)}
                            className="input-own w-full"
                        />
                        <input
                            type="number"
                            placeholder="Maks Kilometer"
                            value={maxKilometer}
                            onChange={(e) => setMaxKilometer(e.target.value)}
                            className="input-own w-full"
                        />



                        <div className="flex flex-col gap-4 mt-8">
                            <p className='font-bold text-gray-400'>Aftale & Pris</p>
                            <input
                                type="number"
                                placeholder="Maks Udbetaling"
                                value={maxPayment}
                                onChange={(e) => setMaxPayment(e.target.value)}
                                className="w-full input-own"
                            />
                            <input
                                type="number"
                                placeholder="Maks Mnd Ydelse"
                                value={maxMonthlyPayment}
                                onChange={(e) => setMaxMonthlyPayment(e.target.value)}
                                className="input-own w-full"
                            />
                            <input
                                type="number"
                                placeholder="Min. Præmie"
                                value={minDiscount}
                                onChange={(e) => setMinDiscount(e.target.value)}
                                className="input-own w-full min-h-10"
                            />
                        </div>


                    </div>
                    {/* Bil & Aftale Filtre SLUT */}
                    <div className='flex flex-col gap-4 sticky bottom-0'>
                        <button onClick={applyFilters} className="apply-filters-button-class primary-button">
                            Vis biler
                        </button>
                        <button onClick={resetFilters} className="reset-filters-button-class">
                            Nulstil filter
                        </button>
                    </div>
                </div>
            </div>


            <button
                onClick={() => setShowFilters(prev => !prev)}
                className="md:hidden block text-blue-500 bg-blue-500/20 px-4 py-2 rounded w-[90%] mt-24 mb-4">
                {showFilters ? 'Skjul filtre' : 'Vis filtre'}
            </button>

            <div className='w-full h-auto flex flex-row flex-wrap justify-center sm:justify-start gap-3 lg:py-20 fade-in'>
                {loading ? <div>Loading...</div> : listings.map((car) => (
                    <ListingCard key={car.listing_id} car={car} />
                ))}
            </div>
        </div>

    );
};

export default AllListingsPage;
