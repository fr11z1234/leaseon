
import CarOverview from '@/components/Pages/Bil/CarOverview';
import ContactOverview from '@/components/Pages/Bil/ContactOverview';
import EquipmentOverview from '@/components/Pages/Bil/EquipmentOverview';
import EstimationOverview from '@/components/Pages/Bil/EstimationOverview';
import PriceOverview from '@/components/Pages/Bil/PriceOverview';
import { supabase } from '@/utils/supabase/server';
import { Metadata } from 'next';

// Force dynamic rendering to always fetch fresh data from the database
export const dynamic = 'force-dynamic';

type Props = {
    params: { slug: string };
};

// Helper function to fetch listing data directly from Supabase
async function fetchListing(carId: string) {
    const { data, error } = await supabase
        .from('carlistings')
        .select('*, listingimages(image_path, is_primary), carbrands(brand_id, brand_name), carlistingequipment(equipment_id), equipment(equipment_id, name)')
        .eq('listing_id', carId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        ...data,
        brand_name: data.carbrands?.brand_name || 'Ukendt',
        images: data.listingimages?.map((i: any) => i.image_path) || [],
        equipment: data.equipment?.map((e: any) => e.name) || []
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const carId = params.slug.split('-')[params.slug.split('-').length - 1];
    const carDetails = await fetchListing(carId);

    if (!carDetails) {
        return {
            title: 'Leaseon.dk - Annonce ikke fundet',
            description: 'Denne annonce findes ikke længere.'
        };
    }

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
    const carDetails = await fetchListing(carId);

    if (!carDetails) {
        return (
            <div className='bg-custom-background w-full flex flex-col justify-center items-center gap-4 py-20'>
                <h1 className='text-2xl font-bold text-slate-900'>Annonce ikke fundet</h1>
                <p className='text-slate-600'>Denne annonce findes ikke længere.</p>
            </div>
        );
    }

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
