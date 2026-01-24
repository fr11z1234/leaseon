export type Listing = {
    listing_id: number
    be_listed: number
    user_id: number | null
    variant: string
    model: string
    month_payment: number
    horsepower: number,
    discount: number
    model_year: number
    images: string[]
    brand_name: string
    brand_id: number
    brand: number
    description: string
    equipment: any[]
    payment: number
    service_book: string
    condition_status: string
    lease_period: number
    form: string
    km_status: string
    fuel_type: string
    type: string
    transmission_type: string
    leasing_type: string
    restvalue: number
    instant_takeover: number
    primaryImage: any | null
}

export const toListing = (supabaseListing: any): Listing => {
    return {
        listing_id: supabaseListing.listing_id,
        be_listed: supabaseListing.be_listed,
        user_id: supabaseListing.user_id,
        variant: supabaseListing.variant,
        model: supabaseListing.model,
        month_payment: supabaseListing.month_payment,
        horsepower: supabaseListing.horsepower,
        discount: supabaseListing.discount,
        model_year: supabaseListing.model_year,
        images: supabaseListing.listingimages.map((image: any) => image.image_path) || [],
        brand_name: supabaseListing.brand_name,
        brand_id: supabaseListing.brand_id,
        brand: supabaseListing.brand,
        description: supabaseListing.description,
        equipment: supabaseListing.equipment ? supabaseListing.equipment.split(',') : [],
        payment: supabaseListing.payment,
        service_book: supabaseListing.service_book,
        condition_status: supabaseListing.condition_status,
        lease_period: supabaseListing.lease_period,
        form: supabaseListing.form,
        km_status: supabaseListing.km_status,
        fuel_type: supabaseListing.fuel_type,
        type: supabaseListing.type,
        transmission_type: supabaseListing.transmission_type,
        leasing_type: supabaseListing.leasing_type,
        restvalue: supabaseListing.restvalue,
        instant_takeover: supabaseListing.instant_takeover,
        primaryImage: supabaseListing.listingimages.find((image: any) => image.is_primary)?.image_path || null,
    };
};
export default function (): Listing {
    return ({
        listing_id: 0,
        be_listed: 1,
        horsepower: 0,
        user_id: null,
        variant: '',
        model: '',
        month_payment: 0,
        discount: 0,
        model_year: 0,
        images: [],
        brand_name: '',
        brand_id: 0,
        brand: 0,
        description: '',
        equipment: [],
        payment: 0,
        service_book: 'Ja',
        condition_status: 'Helt Ny',
        lease_period: 0,
        form: 'Sedan',
        km_status: '',
        fuel_type: 'Benzin',
        transmission_type: 'Manuelt',
        type: 'personbil',
        leasing_type: 'Privat',
        restvalue: 0,
        instant_takeover: 0,
        primaryImage: null
    })
}