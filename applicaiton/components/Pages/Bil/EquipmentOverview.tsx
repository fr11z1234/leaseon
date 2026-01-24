import { Listing } from "@/types/Listing";

export default function ({ carDetails }: { carDetails: Listing }) {
    return (
        <div className='w-full flex flex-col p-10 bg-white border-gray-200 border rounded-sm'>
            <div className='w-full flex flex-col justify-start items-start gap-4'>
                <div className='flex flex-row justify-between w-full'>
                    <ul className='w-full'>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/car.png" alt="car" />Mærke</p><p className='font-bold'>{carDetails.brand_name}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/car.png" alt="model" />Model</p><p className='font-bold'>{carDetails.model}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/car.png" alt="model" />Variant</p><p className='font-bold text-sm'>{carDetails.variant}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/car.png" alt="Cartype" />Biltype</p><p className='font-bold'>{carDetails.form}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/odometer.png" alt="mileage" />Kilometer</p><p className='font-bold'>{carDetails.km_status} km</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/gas-station.png" alt="fueltype" />Brændstof</p><p className='font-bold'>{carDetails.fuel_type}</p></li>
                        <li className="text-slate-600 py-3 border-b justify-between flex-row flex"><p className='flex-row flex gap-2'><img className="w-6" src="https://img.icons8.com/ios/50/000000/gear.png" alt="transmission" />Gearkasse</p><p className='font-bold'>{carDetails.transmission_type}</p></li>
                    </ul>
                </div>

            </div>
        </div>
    )
}