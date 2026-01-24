import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListingCard from './components/cards/ListingCard';
import SearchBar from './components/cards/SearchBar';
import carImageHero from './img/posrche-hero.png';
import Money from './img/Money.svg';
import Document from './img/Document.svg';
import Fire from './img/Fire.svg';
import './App.css';
import PrimaryButton from './components/Buttons/PrimaryButton';
import DarkButton from './components/Buttons/DarkButton';
import suv from './img/suv.svg';
import sedan from './img/sedan.svg';
import stationcar from './img/stationcar.svg';
import van from './img/van.svg';
import cabriolet from './img/cabriolet.svg';
import coupe from './img/coupe.svg';
import crossover from './img/crossover.svg';
import hatchback from './img/hatchback.svg';
import UploadImageFront from './components/UploadImageFront';

// navigation
import Sidebar from './components/Sidebar';

// Pages
import CarDetailPage from './CarDetailPage';
import AllListingsPage from './AllListingsPage';
import CreateUser from './CreateUser';
import Login from './Login';
import EditListingPage from './EditListingPage';
import CreateListingPage from './CreateListingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './Dashboard';
import logo from './img/logo.svg';




import { Link } from 'react-router-dom';

import useFadeInOnScroll from './components/Fadein.js';






function App() {


    return (
        <Router>
            <div className='fixed top-0 left-0 w-full h-30 flex items-center z-50 justify-center'>
                <div className='w-full flex flex-row max-w-laptop justify-between items-center py-2'>
                    <Link to="/">
                        <img src={logo} alt="Leaseon" className="w-[200px] h-auto" />
                    </Link>
                    < Sidebar />
                </div>
            </div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:listingId" element={<CarDetailPage />} /> {/* det her er single car view */}
                <Route path="/all-listings" element={<AllListingsPage />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/upload-images" element={<UploadImageFront />} />
                <Route path="/edit-listing/:listingId" element={<EditListingPage />} />
                <Route path="/create-listing" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </Router >
    );
}



const HomePage = () => {
    const [highestDiscountListings, setHighestDiscountListings] = useState([]);
    const [newestListings, setNewestListings] = useState([]);
    const [listings, setListings] = useState([]); // Dette er alle listings
    const [CarTypes, setCarTypes] = useState([]); // Dette er alle listings
    useFadeInOnScroll(); // fade in effect
    useEffect(() => {
        fetch('http://localhost:5000/carlistings') // Dette er alle listings
            .then(response => response.json())
            .then(data => setListings(data))
            .catch(error => console.error(error));

        fetch('http://localhost:5000/carlistings/highest-discounts') // Dette er Højeste discounts listings
            .then(response => response.json())
            .then(data => setHighestDiscountListings(data))
            .catch(error => console.error(error));

        fetch('http://localhost:5000/carlistings/newest') // Dette er nyeste listings
            .then(response => response.json())
            .then(data => setNewestListings(data))
            .catch(error => console.error(error));


        // New fetch for car types
        fetch('http://localhost:5000/car-types') // biltyper endpoint
            .then(response => response.json())
            .then(data => setCarTypes(data))
            .catch(error => console.error('Error fetching car types:', error));

    }, []);

    return (
        <>


            {/* Your home page content */}
            <div className="w-full bg-custom-hero h-auto py-52 flex flex-col justify-center align-middle items-center space-y-6 relative z-0">
                <p className="text-50 text-sm text-slate-900">De bedste leasing tilbud</p>
                <h1 className="text-50 text-5xl text-slate-900 font-bold">Find din drømme bil</h1>
                <img src={carImageHero} alt="car" className="w-3/4 h-auto absolute -bottom-12 sm:-bottom-28 max-w-4xl fade-in" />
                <SearchBar />
            </div>
            {/* Other components/content of your homepage */}


            {/* Biltype Sektion Start */}
            <div className='h-auto bg-white py-44 items-center flex flex-col'>
                <h3 className='text-xl font-bold text-slate-900 fade-in'>Søg efter biltype</h3>
                <div className='flex-row flex w-full gap-4 max-w-laptop flex-wrap justify-center py-7 fade-in'>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={suv} alt='SUV car' className='w-full' />
                        <p className='text-sm'>SUV</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={crossover} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Crossover</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={coupe} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Coupe</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={stationcar} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Stationcar</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={hatchback} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Hatchback</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={sedan} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Sedan</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={van} alt='SUV car' className='w-full' />
                        <p className='text-sm'>Van</p>
                    </div>
                    <div className='border flex flex-col gap-2 border-gray-200 w-32 h-24 justify-center items-center p-10 rounded-md hover:border-blue-600 transition ease-in duration-100 cursor-pointer'>
                        <img src={cabriolet} alt='SUV car' className='w-full' />
                        <p className='text-sm'>cabriolet</p>
                    </div>
                </div>
            </div>
            {/* Biltype Sektion Slut */}



            {/* Blå og Lyserød Bok Sektion start */}
            <div className='h-auto bg-white flex flex-row w-full self-center justify-center pb-36 px-2 sm:px-0 fade-in'>
                <div className='max-w-laptop flex-row flex gap-10 justify-center flex-wrap'>
                    <div className='w-full sm:w-laptop-half-gap bg-indigo-50 p-10 rounded-xl gap-4 flex flex-col  '>
                        <h2 className='font-medium text-2xl'><span className='text-blue-500'>Leder du</span> efter en<br></br>
                            leasing bil ?</h2>
                        <p className='min-h-40'>Hos os finder du private der skal af med deres leasing bil, og nogle af dem tilbyder præmie for overtagelse, så du kan finde de billigste leasing tilbud i danmark på vores side. </p>
                        <Link to="/all-listings">
                            <PrimaryButton />
                        </Link>
                    </div>
                    <div className='w-full sm:w-laptop-half-gap bg-pink-100 p-10 rounded-xl gap-4 flex flex-col justify-between'>
                        <h2 className='font-medium text-2xl '>Skal du af med din Leasing aftale <span className='text-blue-500'>hurtigst muligt?</span></h2>
                        <p className='min-h-40'>Hos os finder du private der skal af med deres leasing bil, og nogle af dem tilbyder præmie for overtagelse, så du kan finde de billigste leasing tilbud i danmark på vores side. </p>
                        <Link to="/create-listing">
                            <DarkButton />
                        </Link>
                    </div>
                </div>
            </div >
            {/* Blå og Lyserød Bok Sektion Slut */}


            {/*Største Præmie Listings Sektion start */}
            <div className='w-full h-auto flex flex-col justify-center items-center '>
                <h2 className='text-center px-5  text-3xl text-slate-900 font-bold mb-5 fade-in'>De Største 💸 Præmiepuljer</h2>
                <p className='text-center px-5 text-50 text-sm text-slate-900 fade-in'>Opslag fra sælgere der tilbyder den største penge pulje hvis du overtager kontrakten.</p>
                <div className='w-full h-auto py-20 flex flex-row flex-wrap justify-center gap-4 fade-in'>
                    {highestDiscountListings.map((highestDiscountListings, index) => (
                        <ListingCard key={index} car={highestDiscountListings} />
                    ))}
                </div>
            </div>
            {/*Største Præmie Listings Sektion Slut */}



            {/*Hvorfor Leasevidere Sektion start */}
            <div className='w-full h-auto py-20 flex flex-col justify-center items-center fade-in'>
                <h2 className='text-center px-5 sm:pl-0 text-3xl text-slate-900 font-bold mb-5'>Hvorfor Bruge Leaseon ?</h2>
                <p className='text-center px-5 sm:pl-0 text-50 text-sm text-slate-900'>Opslag fra sælgere der tilbyder den største penge pulje hvis du overtager kontrakten.</p>
                <div className='w-full max-w-laptop h-auto py-20 flex flex-row gap-4 justify-center flex-wrap'>
                    <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                        <img src={Money} alt='money' className='w-9 h-9' />
                        <h3 className='text-lg text-slate-900 font-bold'>Spar Penge</h3>
                        <p className='text-50 text-slate-900'>Vores salgspræmie funktion giver dig muligheden for at opnå de billigste leasingaftaler på nettet.</p>
                    </div>
                    <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                        <img src={Document} alt='money' className='w-9 h-9' />
                        <h3 className='text-lg text-slate-900 font-bold'>Find en leasing tager på rekord tid</h3>
                        <p className='text-50 text-slate-900'>Tilknyt en salgspræmie, der gør tilbuddet mere attraktivt og øg chancen for et salg, salgspræmie er ikke påkrævet.</p>
                    </div>
                    <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                        <img src={Fire} alt='money' className='w-9 h-9' />
                        <h3 className='text-lg text-slate-900 font-bold'>Spar penge på stilstand & Værditab</h3>
                        <p className='text-50 text-slate-900'>Salgspræmien skal ikke ses som en udgift, men som en besparelse på evt værditab ved salg til forhandler, eller stilstand af bilen.</p>
                    </div>
                </div>
            </div>
            {/*Hvorfor Leasevidere Sektion slut */}


            {/* Nyeste Annoncer Sektion start */}
            <div className='w-full h-auto flex flex-col justify-center items-center fade-in'>
                <h2 className='text-3xl text-slate-900 font-bold mb-5'>Nyeste Annoncer</h2>
                <p className='text-50 text-sm text-slate-900'>Opslag fra sælgere der tilbyder den største penge pulje hvis du overtager kontrakten.</p>
                <div className='w-full h-auto py-20 flex flex-row flex-wrap justify-center gap-4'>
                    {newestListings.map((newestListings, index) => (
                        <ListingCard key={index} car={newestListings} />
                    ))}
                </div>
            </div>
            {/* Nyeste Annoncer Sektion Slut */}

        </>
    );
}
export default App;
