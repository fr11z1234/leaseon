import ListingCard from "@/components/cards/ListingCard";
import { listingStore } from "@/stores/ListingStore"

async function getData() {
    await listingStore.getState().fetchNewest();
    return listingStore.getState().newest || [];
}

export default async function NewestSection() {
    const newestListings = await getData();

    if (newestListings.length === 0) {
        return null;
    }

    return (
        <div className='w-full h-auto flex flex-col justify-center items-center fade-in'>
            <h2 className='text-center px-5 sm:pl-0 text-3xl text-slate-900 font-bold mb-5'>Nyeste Annoncer</h2>
            <p className='text-center px-5 sm:pl-0 text-50 text-sm text-slate-900'>De Nyeste opslag og leasingaftaler på hjemmesiden</p>
            <div className='w-full h-auto pt-10 pb-20 flex flex-row flex-wrap justify-center gap-3 max-w-laptop'>
                {newestListings.map((listing, index) => (
                    <ListingCard key={index} car={listing} />
                ))}
            </div>
        </div>
    )
}