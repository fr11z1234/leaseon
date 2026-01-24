
import CarOverview from '@/components/Pages/Bil/CarOverview';
import ContactOverview from '@/components/Pages/Bil/ContactOverview';
import EquipmentOverview from '@/components/Pages/Bil/EquipmentOverview';
import EstimationOverview from '@/components/Pages/Bil/EstimationOverview';
import PriceOverview from '@/components/Pages/Bil/PriceOverview';
import { listingStore } from '@/stores/ListingStore';
import { Metadata } from 'next';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const carId = params.slug.split('-')[params.slug.split('-').length - 1];
    await listingStore.getState().fetch(carId); // Fetch car data
    const carDetails = listingStore.getState().listing;

    return {
        title: `Leaseon.dk - Leasing af ${carDetails.model} ${carDetails.variant}`,
        description: `Få det bedste leasingtilbud på en ${carDetails.model} ${carDetails.variant} hos Leaseon.dk - Med en besparelse på ${(carDetails.discount ?? 0).toLocaleString('de-DE')} kr ved udbetalingen, og en mnd ydelse på kun ${(carDetails.month_payment ?? 0).toLocaleString('de-DE')} kr`,
        other: {
            'og:title': `Leaseon.dk - Leasing af ${carDetails.model} ${carDetails.variant} (${carDetails.model_year})`,
            'og:description': `Få det bedste leasingtilbud på en ${carDetails.model} ${carDetails.variant} (${carDetails.model_year}) hos Leaseon.dk - Med en besparelse på ${(carDetails.discount ?? 0).toLocaleString('de-DE')} kr ved udbetalingen, og en mnd ydelse på kun ${(carDetails.month_payment ?? 0).toLocaleString('de-DE')} kr`,
            'og:image': `https://api.leaseon.dk/${carDetails.images[0]}`,
            'og:type': 'website',
            'og:url': `https://leaseon.dk/biler/${params.slug}`
        }
    }
}


export default async function ({ params }: Props) {

    const carId = params.slug.split('-')[params.slug.split('-').length - 1];
    await listingStore.getState().fetch(carId);
    const carDetails = listingStore.getState().listing;

    return (
        <div className='bg-custom-background w-full flex flex-col justify-center items-center gap-4 py-20'>

            <div className='w-full flex flex-col justify-center items-center gap-4 h-auto px-5 py-10'>
                <div className='w-full max-w-laptop flex flex-col'>
                    <h1 className='text-4xl font-bold text-slate-900'>{carDetails.brand_name} ({carDetails.model_year})</h1>
                    <p className='text-slate-900'>{carDetails.model} {carDetails.variant}</p>
                </div>
                <div className='w-full max-w-laptop flex flex-row gap-8 justify-between flex-wrap h-auto'>
                    <CarOverview carDetails={carDetails} />

                    <div className='w-full sm:w-[400px] flex flex-col h-auto gap-8'>
                        <PriceOverview carDetails={carDetails} />
                        <ContactOverview />
                        <EquipmentOverview carDetails={carDetails} />
                        <EstimationOverview carDetails={carDetails} />
                    </div>
                </div>
            </div>
        </div >
    )
};
