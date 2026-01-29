import { create } from 'zustand'
import DefaultListing, { Listing } from '@/types/Listing'
import DefaultListingContact, { ListingContact } from '@/types/ListingContact'
import { supabase } from '../utils/supabase/server'
import { max } from 'lodash'
import { carStore } from './CarStore'

type Search = {
    brandFilter: string[]
    modelFilter: string[]
    typeFilter: string[]
    fuelFilter: string[]
    gearFilter: string[]
    search: string[]
    maxYear: string
    minYear: string
    page: number
    maxKilometer: string
    maxPayment: string
    maxMonthlyPayment: string
    minDiscount: string
}

type State = {
    count: number
    listing: Listing
    listingContact: ListingContact | null
    contactFetched: boolean
    listings: Listing[]
    highestDiscounts: Listing[]
    newest: Listing[]
    search: Search
    loading: boolean,
    prev_search: string
}

type Actions = {
    fetch: (id: string) => void
    fetchContactDetails: (id: string) => void
    fetchHighestDiscounts: () => void
    fetchNewest: () => void
    setSearch: (search: string[]) => void
    setBrand: (search: string[]) => void
    setModel: (search: string[]) => void
    setType: (search: string[]) => void
    resetFilters: () => void
    fetchListings: () => void
}

const searchDefault: Search = {
    brandFilter: [],
    modelFilter: [],
    typeFilter: [],
    fuelFilter: [],
    gearFilter: [],
    search: [],
    maxYear: '',
    minYear: '',
    page: 1,
    maxKilometer: '',
    maxPayment: '',
    maxMonthlyPayment: '',
    minDiscount: ''
}

export const listingStore = create<State & Actions>((set, get) => ({
    loading: false,
    listing: DefaultListing(),
    listingContact: null,
    contactFetched: false,
    listings: [],
    highestDiscounts: [],
    newest: [],
    count: 0,
    prev_search: '',
    fetch: async (id) => {
        try {
            // Reset contact state when fetching new listing
            await set({ listingContact: null, contactFetched: false });
            
            const { data, error } = await supabase
                .from('carlistings')
                .select('*, listingimages(image_path, is_primary), carbrands(brand_id, brand_name), carlistingequipment(equipment_id), equipment(equipment_id, name)')
                .eq('listing_id', id)
                .single();
            data.brand_name = data.carbrands.brand_name;
            data.images = data.listingimages.map((i: any) => i.image_path);
            data.equipment = data.equipment.map((e: any) => e.name);
            await set({ listing: data });
        } catch (e) {
            console.error(e)
        }
    },
    fetchContactDetails: async (id) => {
        await set({ loading: true, contactFetched: false });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', id)
                .maybeSingle();
            await set({ listingContact: data, contactFetched: true });
        } catch (e) {
            console.error(e)
            await set({ contactFetched: true });
        }
        await set({ loading: false });
    },
    fetchHighestDiscounts: async () => {
        try {
            const { data, error } = await supabase
                .from('carlistings')
                .select('*, listingimages(image_path, is_primary), carbrands(brand_name)')
                .eq('be_listed', 1)
                .order('discount', { ascending: false })
                .limit(4);
            
            if (error) {
                console.error('Error fetching highest discounts:', error);
                return;
            }
            
            const cleaned_data = data?.map(d => ({ 
                ...d, 
                brand_name: d.carbrands?.brand_name || 'Ukendt',
                listingimages: d.listingimages || [],
                images: (d.listingimages || []).map((i: any) => i.image_path) 
            })) || [];
            
            set({ highestDiscounts: cleaned_data as Listing[] });
        } catch (e) {
            console.error('Error in fetchHighestDiscounts:', e)
        }
    },
    fetchNewest: async () => {
        try {
            const { data, error } = await supabase
                .from('carlistings')
                .select('*, listingimages(image_path, is_primary), carbrands(brand_name)')
                .eq('be_listed', 1)
                .order('listing_id', { ascending: false })
                .limit(4);
            
            if (error) {
                console.error('Error fetching newest:', error);
                return;
            }
            
            const cleaned_data = data?.map(d => ({ 
                ...d, 
                brand_name: d.carbrands?.brand_name || 'Ukendt',
                listingimages: d.listingimages || [],
                images: (d.listingimages || []).map((i: any) => i.image_path) 
            })) || [];
            
            set({ newest: cleaned_data as Listing[] });
        } catch (e) {
            console.error('Error in fetchNewest:', e)
        }
    },
    resetFilters: () => {
        set({
            search: searchDefault
        });
    },
    fetchListings: async () => {

        const newFilters = {
            ...({ brand: get().search.brandFilter.join(',') }),
            ...({ model: get().search.modelFilter.join(',') }),
            ...({ form: get().search.typeFilter.join(',') }),
            ...({ model_year: get().search.maxYear }),
            ...({ min_model_year: get().search.minYear }),
            ...({ km_status: get().search.maxKilometer }),
            ...({ discount: get().search.minDiscount }),
            ...({ payment: get().search.maxPayment }),
            ...({ month_payment: get().search.maxMonthlyPayment }),
            ...({ fuel_type: get().search.fuelFilter.join(',') }),
            ...({ transmission_type: get().search.gearFilter.join(',') }),
            ...({ search: get().search.search.join(',') }),
            ...({ page: get().search.page.toString() }),
        };

        const queryParams = new URLSearchParams(newFilters).toString();

        for (const [key, value] of Object.entries(newFilters)) {
            if (value === '' || value === null || value === undefined) {
                delete (newFilters as any)[key];
            }
        }
        const queryParamsCleaned = new URLSearchParams(newFilters).toString();

        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
            window.history.pushState({}, '', `?${queryParamsCleaned}`);
        }
        if (queryParams === get().prev_search) {
            return
        } else {
            set({ prev_search: queryParams });
        }

        await set({ loading: true });

        try {

            const searchObj = {
                brand: newFilters.brand || null,
                fuel_type: newFilters.fuel_type || null,
                transmission_type: newFilters.transmission_type || null,
                form: newFilters.form || null,
                payment: parseInt(newFilters.payment) || null,
                month_payment: parseInt(newFilters.month_payment) || null,
                km_status: parseInt(newFilters.km_status) || null,
                discount: parseInt(newFilters.discount) || null,
                min_model_year: parseInt(newFilters.min_model_year) || null,
                model_year: parseInt(newFilters.model_year) || null,
                model: newFilters.model || null,
                page: parseInt(newFilters.page) || 1
            };

            await carStore.getState().fetchBrands(false);
            const brands = carStore.getState().brands;
            const selected = searchObj.brand?.split(',');

            const accepted_brand_ids = [];
            for (const k in selected) {
                const brand = selected[k as any];
                const target = brands.filter(tar => tar.value == brand)[0] ?? null;
                if (target) accepted_brand_ids.push(target.id);
            }

            let query = supabase.from('carlistings').select(`
                listing_id,
                model,
                variant,
                model_year,
                form,
                fuel_type,
                transmission_type,
                type,
                km_status,
                lease_period,
                payment,
                month_payment,
                horsepower,
                discount,
                brand_name:carbrands(brand_name),
                image_path:listingimages(image_path),
                listingimages(image_path, is_primary),
                carbrands(brand_name)
                adjusted_payment: (payment - COALESCE(discount, 0))
            `);
            query = query.filter('be_listed', 'neq', 0);

            if (searchObj.brand !== null) query = query.in(`brand_id`, accepted_brand_ids);
            if (searchObj.fuel_type !== null) query = query.in(`fuel_type`, searchObj.fuel_type.split(','));
            if (searchObj.transmission_type !== null) query = query.in(`transmission_type`, searchObj.transmission_type.split(','));
            if (searchObj.form !== null) query = query.in(`form`, searchObj.form.split(','));
            if (searchObj.payment !== null) query = query.lte(`payment`, searchObj.payment);
            if (searchObj.month_payment !== null) query = query.lte(`month_payment`, searchObj.month_payment);
            if (searchObj.km_status !== null) query = query.lte(`km_status`, searchObj.km_status);
            if (searchObj.discount !== null) query = query.gte(`discount`, searchObj.discount);
            if (searchObj.min_model_year !== null) query = query.gte(`model_year`, searchObj.min_model_year);
            if (searchObj.model_year !== null) query = query.lte(`model_year`, searchObj.model_year);
            if (searchObj.model !== null) query = query.like(`model`, `${searchObj.model}%`);

            query.order('listing_id', { ascending: false })
                .range((searchObj.page - 1) * 10, (searchObj.page * 10) - 1);

            const { data, error } = await query;

            const filtered_data = data?.map((d: any) => {
                return {
                    ...d,
                    brand_name: d.brand_name.brand_name,
                }
            });

            await set({
                listings: filtered_data as any, count: filtered_data?.length
            });
        } catch (e) {
            console.error(e);
        }
        await set({ loading: false });
    },

    /* SEARCH AND FILTER */

    search: searchDefault,

    setSearch: (search) => {
        const current = get().search;
        current.search = search;
        set({ search: current });
    },
    setModel: (models) => {
        const current = get().search;
        current.modelFilter = models;
        set({ search: current });
    },
    setBrand: (brands) => {
        const current = get().search;
        current.brandFilter = brands;
        set({ search: current });
    },
    setType: (types) => {
        const current = get().search;
        current.typeFilter = types;
        set({ search: current });
    },

}))