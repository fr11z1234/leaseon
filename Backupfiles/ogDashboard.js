import React, { useEffect, useState } from 'react';
import EditableListingCard from './components/cards/EditableListingCard';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { Link, useNavigate } from 'react-router-dom'; // Updated import

import useFadeInOnScroll from './components/Fadein.js';

function Dashboard() {
    const [listings, setListings] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); // Updated for react-router-dom v6

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('userToken');
                    navigate('/login');
                    return;
                }

                setUserId(decodedToken.userId);

                fetch('http://localhost:5000/user-listings', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch listings');
                        }
                        return response.json();
                    })
                    .then(data => setListings(data))
                    .catch(error => {
                        console.error('Error fetching user listings:', error);
                        localStorage.removeItem('userToken');
                        navigate('/login');
                    });
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Function to handle deletion of a listing
    const handleDeleteListing = (listingId) => {
        // Implement the deletion logic here
        // You might want to make a DELETE request to your server
    };

    useFadeInOnScroll(); // fade in effect

    return (

        <div className='flex flex-row w-full fade-in'>
            <div className='flex flex-col justify-center items-center w-full bg-custom-background  py-20'>
                <div className='flex flex-col w-full p-6 sm:flex-row sm:w-[1240px] gap-4 sm:p-0'>
                    <div className='flex flex-col sm:w-1/5 bg-white rounded-md border border-gray-200 px-4 pt-4 pb-[200px] h-fit sticky top-[80px]'>
                        <div className='flex flex-row gap-3 text-slate-900 font-medium text-md transition ease-in-out p-3 rounded-sm cursor-pointer border-b border-blue-100  hover:text-blue-500 hover:bg-blue-100 '>Mine Annoncer</div>
                        <div className='flex flex-row gap-3 text-slate-900 font-medium text-md transition ease-in-out p-3 rounded-sm cursor-pointer border-b border-blue-100  hover:text-blue-500 hover:bg-blue-100 '>Mine Oplysninger</div>
                    </div>
                    <div className='flex flex-col sm:w-5/6 p-10 justify-center items-start bg-white rounded-md border border-gray-200'>



                        <div className='flex flex-col gap-4 justify-center text-center items-center h-fit mb-8 sm:text-start sm:flex-row w-full sm:justify-start sm:gap-0'>
                            <h1 className='text-2xl font-bold text-between items-center w-full'>Dine annoncer</h1>
                            <Link to="/create-listing">
                                <button className='primary-button'>Opret annoncer</button>
                            </Link>
                        </div>
                        <div className='flex flex-row w-full flex-wrap gap-4 justify-start'>
                            {listings.map(listing => (
                                <EditableListingCard
                                    key={listing.listing_id}
                                    car={listing}
                                    isOwner={userId === listing.user_id}
                                    onDelete={handleDeleteListing}
                                />
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;
