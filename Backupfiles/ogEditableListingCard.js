import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EditableListingCard = ({ car, isOwner }) => {
    if (!car) {
        return 'Loading...';
    }

    // Decide what to do when clicking on the card
    const cardClickAction = isOwner ? `/edit-listing/${car.listing_id}` : `/car/${car.listing_id}`;

    // Conditionally apply the "greyed-out" style
    const cardStyle = car.be_listed === 0 ? "opacity-20" : "opacity-100";
    const solgtbil = car.be_listed === 0 ? "Markeret som Solgt" : "";

    return (
        <Link to={cardClickAction} className="listing-card">

            <div key={car.listing_id} className={` bg-slate-900 text-white rounded-lg shadow-md overflow-hidden relative w-72 hover:scale-105 transition ease-in duration-100 cursor-pointer`}>
                <p className="text-xl font-medium text-red-500 absolute top-[25%] left-10 opacity-100">{solgtbil}</p>
                <div className={`${cardStyle}`}>
                    <img className='h-[220px] object-cover' src={car.images?.length > 0 ? `${process.env.REACT_APP_API_BASE_URL}/${car.images[0]}` : 'defaultImageURL'} alt={car.model} />
                    <div className="">

                        <div>
                            <div className='p-5'>
                                <h3 className=" font-medium text-lg mb-2">{car.brand_name}</h3>
                                <h3 className=" font-medium text-xs min-h-[32px]">{car.model} {car.variant} </h3>
                                <div className="flex items-center mt-2">
                                    <span className="text-xl font-bold">{new Intl.NumberFormat('da-DK').format(car.payment - car.discount)} DKK</span>
                                    <span className="text-sm line-through text-gray-400 ml-2">{new Intl.NumberFormat('da-DK').format(car.payment)} DKK</span>
                                </div>
                            </div>
                            <span className="bg-emerald-100 text-xs font-medium tracking-wide text-green-500 rounded px-2 py-1 absolute top-5 right-5">💸 {new Intl.NumberFormat('da-DK').format(car.discount)} DKK</span>
                        </div>
                        <div className="flex items-center space-x-4 p-5 justify-between border-solid border-gray-700 border-t border-b">
                            <div className="flex items-center justify-center space-x-2 flex-col">
                                <img className="w-6" src="https://img.icons8.com/ios/50/ffffff/odometer.png" alt="mileage" />
                                <span className='text-xs'>{new Intl.NumberFormat('da-DK').format(car.km_status)} km</span>
                            </div>
                            <div className="flex items-center space-x-2 flex-col">
                                <img className="w-6" src="https://img.icons8.com/ios/50/ffffff/gas-station.png" alt="fuelType" />
                                <span className='text-xs max-w-14 overflow-hidden text-ellipsis whitespace-nowrap'>{car.fuel_type}</span>
                            </div>
                            <div className="flex items-center space-x-2 flex-col">
                                <img className="w-6" src="https://img.icons8.com/ios/50/ffffff/automatic.png" alt="transmission" />
                                <span className='text-xs'>{car.transmission_type}</span>
                            </div>
                        </div>
                        <div className="flex flex-row mt-4 justify-between p-5">
                            <span className="text-white font-medium text-s ">{new Intl.NumberFormat('da-DK').format(car.month_payment)} DKK / mnd</span>
                            <span className=""><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M3 21L12 21H21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.2218 5.82839L15.0503 2.99996L20 7.94971L17.1716 10.7781M12.2218 5.82839L6.61522 11.435C6.42769 11.6225 6.32233 11.8769 6.32233 12.1421L6.32233 16.6776L10.8579 16.6776C11.1231 16.6776 11.3774 16.5723 11.565 16.3847L17.1716 10.7781M12.2218 5.82839L17.1716 10.7781" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

EditableListingCard.propTypes = {
    car: PropTypes.object.isRequired,
    isOwner: PropTypes.bool.isRequired
};

export default EditableListingCard;
