import { create } from 'zustand'
import { redirect, useRouter } from 'next/navigation'
import DefaultUser, { User } from '@/types/User'
import DefaultListing, { Listing, toListing } from '@/types/Listing'
import { supabase } from '../utils/supabase/server'
import { resizeImage, fileUpload } from '../utils/img'
import { update } from 'lodash'

type State = {
    isLoggedIn: boolean
    fetching: boolean
    loading: boolean
    user: User
    listings: Listing[]
    listing: Listing,
    userId: string
}

type Actions = {
    checkAuth: () => Promise<boolean>
    logout: () => Promise<boolean>
    createUser: (data: User) => Promise<boolean>
    login: (email: string, password: string) => Promise<boolean>
    fetchUser: () => Promise<boolean>
    fetchListings: () => Promise<boolean>
    fetchListing: (id: number) => Promise<boolean>
    createListing: (input: any) => Promise<boolean>
    deleteListing: (id: number) => Promise<boolean>
    updateListing: (data: Listing) => Promise<boolean>
    uploadImages: (selectedFiles: any, listingId: number, primaryImageIndex: any) => Promise<string>
    updateUser: () => Promise<boolean>
}

export const userStore = create<State & Actions>((set, get) => ({
    isLoggedIn: false,
    user: DefaultUser(),
    fetching: false,
    loading: false,
    listings: [],
    listing: DefaultListing(),
    userId: "",
    login: async (email: string, password: string) => {
        // Assuming you have already initialized the Supabase client
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Kunne ikke logge ind', error);
            return false;
        } else {
            set({ isLoggedIn: true });
            return true;
        }
    },
    createUser: async (input: User) => {
        set({ loading: true });
        set({ fetching: true });

        const { data, error } = await supabase.auth.signUp({
            email: input.email,
            password: input.password
        });

        if (error) {
            console.error('Kunne ikke oprrette bruger', error);
            set({ fetching: false });
            set({ loading: false });
            return false;
        } else {
            const user = data.user;
            set({ fetching: false });
            if (!user) {
                console.error('Kunne ikke finde bruger');
                return false;
            }
            set({ isLoggedIn: true });

            let profile_picture = "";
            if (input.profilePicture) {
                const img = await fileUpload(input.profilePicture, 1000);
                profile_picture = img.uuid;
            }


            // Now insert the profile data
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        user_id: user.id, // Link the profile to the newly created user
                        first_name: input.firstName,
                        last_name: input.lastName,
                        email: input.email,
                        phone: input.phone,
                        city: input.city,
                        facebook_profile: input.facebookProfile,
                        profile_picture_path: profile_picture,
                    }]);
            set({ loading: false });
            if (error) return false;

            return true;
        }
    },
    fetchUser: async () => {
        set({ fetching: true });
        try {

            // Assuming you have already initialized the Supabase client
            const { data: session } = await supabase.auth.getSession();
            const ses = session as any;
            if (ses) {
                const userId = ses?.user?.id; // Get the logged-in user's ID

                // Fetch the user profile from the profiles table
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', userId)
                    .single(); // Use .single() to get a single record

                if (error) {
                    set({ fetching: false });
                    console.error('Error fetching user profile:', error.message);
                    return false;
                } else {
                    await set({
                        user: {
                            firstName: profile.first_name,
                            lastName: profile.last_name,
                            email: profile.email,
                            phone: profile.phone,
                            city: profile.city,
                            password: '',
                            confirmPassword: '',
                            profilePicture: profile.profile_picture,
                            facebookProfile: profile.facebook_profile || '',
                        }
                    });
                    set({ fetching: false });
                    return true;
                }
            } else {
                set({ fetching: false });
                return false;
            }
        } catch (e) {
            console.error('Kunne ikke hente bruger', e);
            set({ fetching: false });
            return false;
        }
    },
    updateUser: async () => {
        try {
            const user: User = get().user;

            const auth = await supabase.auth.getSession();

            const { data, error } = await supabase.from('profiles')
                .update({
                    first_name: user.firstName,
                    last_name: user.lastName,
                    phone: user.phone,
                    city: user.city,
                    facebook_profile: user.facebookProfile
                })
                .eq('user_id', auth.data.session?.user.id);

            if (error) return false;

            return true;
        } catch (e) {
            console.error('Kunne ikke opdatere bruger', e);
            return false;
        }
    },
    checkAuth: async () => {
        if (!get().loading) {
            set({ loading: true });
            try {

                const auth = await supabase.auth.getSession();
                const userId = auth.data.session?.user.id;

                set({ userId: userId });
                set({ isLoggedIn: !!auth.data.session });
                set({ loading: false });
                return !!auth.data.session;
            } catch (e) {
                console.error('Kunne ikke logge ind', e);
                set({ loading: false });
                return false;
            }
        } else {
            return new Promise((resolve) => {
                const timeoutEvent = window.setInterval(() => {
                    if (!get().loading) {
                        resolve(get().isLoggedIn);
                        window.clearInterval(timeoutEvent);
                    }
                }, 300);
            });
        }
    },
    logout: async () => {
        await supabase.auth.signOut();

        set({ isLoggedIn: false })
        return true;
    },
    fetchListings: async () => {
        await set({ fetching: true });

        const userId = get().userId;
        const { data, error } = await supabase
            .from('carlistings')
            .select('*, listingimages(image_path, is_primary)')
            .eq('user_id', userId);

        if (error) {
            await set({ fetching: false });
            return false;
        }

        const listingsMap = data?.map(datum => toListing(datum));
        await set({ listings: listingsMap });
        await set({ fetching: false });
        return true;
    },
    fetchListing: async (id: number) => {
        return new Promise(async (resolve) => {
            await set({ fetching: true });

            const userId = get().userId;
            const { data, error } = await supabase
                .from('carlistings')
                .select('*, listingimages(image_path, is_primary), carbrands(brand_id, brand_name), carlistingequipment(equipment_id), equipment(equipment_id, name)')
                .eq('user_id', userId)
                .eq('listing_id', id)
                .single();
            data.brand_name = data.carbrands.brand_name;
            data.images = data.listingimages.map((i: any) => i.image_path);
            for (let i in data.listingimages) {
                const image = data.listingimages[i];
                if (image.is_primary) {
                    data.primaryImage = { path: image.image_path, index: i };
                    data.primary_image = { path: image.image_path, index: i };
                    break;
                }
            }
            data.equipment = data.equipment.map((e: any) => e.equipment_id);

            if (error) {
                await set({ fetching: false });
                resolve(false);
            }
            await set({ listing: data });
            await set({ fetching: false });
            resolve(true);

        })
    },
    deleteListing: async (id: number) => {
        await set({ fetching: true });

        const userId = get().userId;
        const { data, error } = await supabase
            .from('carlistings')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', id);

        if (error) {
            await set({ fetching: false });
            return false;
        }
        await set({ listing: DefaultListing() });
        await set({ fetching: false });
        return true;
    },
    updateListing: async (input: any) => {

        await set({ fetching: true });
        await set({ loading: true });
        const userId = get().userId;
        const listingId = input.listing_id;
        // Start a transaction
        const { data: listingData, error: updateError } = await supabase
            .from('carlistings')
            .update({
                be_listed: input.be_listed,
                description: input.description,
                type: input.type,
                form: input.form,
                brand_id: input.brand_id,
                model: input.model,
                model_year: input.model_year,
                fuel_type: input.fuel_type,
                transmission_type: input.transmission_type,
                variant: input.variant,
                horsepower: input.horsepower,
                service_book: input.service_book,
                km_status: input.km_status,
                condition_status: input.condition_status,
                leasing_type: input.leasing_type,
                instant_takeover: input.instant_takeover,
                payment: input.payment,
                month_payment: input.month_payment,
                lease_period: input.lease_period,
                restvalue: input.restvalue,
                discount: input.discount
            })
            .eq('listing_id', listingId)
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating listing:', updateError.message);
            await set({ fetching: false });
            await set({ loading: false });
            return false;
        }

        // Delete existing equipment
        await supabase.from('carlistingequipment').delete().eq('listing_id', listingId);

        const equipment = input.equipment;
        // Insert new equipment
        if (equipment && equipment.length) {
            const equipmentValues = equipment.map((id: any) => ({ listing_id: listingId, equipment_id: id }));
            const { error: insertError } = await supabase.from('carlistingequipment').insert(equipmentValues);
            if (insertError) {
                console.error('Error updating listing:', insertError.message);
                await set({ fetching: false });
                await set({ loading: false });
                return false;
            }
        }

        const imagesToRemove = input.imagesToRemove;
        if (imagesToRemove && imagesToRemove.length) {
            for (const imagePath of imagesToRemove) {
                const { error: deleteImageError } = await supabase
                    .from('listingimages')
                    .delete()
                    .eq('image_path', imagePath)
                    .eq('listing_id', listingId);

                if (deleteImageError) {
                    console.error('Error deleting image from database:', deleteImageError.message);
                }
            }
        }

        const existingPrimary = input.existingPrimary;
        // Reset and set primary image logic
        if (existingPrimary) {
            await supabase
                .from('listingimages')
                .update({ is_primary: 0 })
                .eq('listing_id', listingId);

            await supabase
                .from('listingimages')
                .update({ is_primary: 1 })
                .eq('image_path', existingPrimary)
                .eq('listing_id', listingId);
        }

        await set({ fetching: false });
        await set({ loading: false });
        return true;
    },
    uploadImages: async (selectedFiles: any, listingId: number, primaryImageIndex: any) => {
        set({ loading: true });
        set({ fetching: true });
        let result = null as any;
        for (let i in selectedFiles) {
            const img = selectedFiles[i];
            const path = await fileUpload(img, 3000);
            await supabase.from('listingimages').insert({
                listing_id: listingId,
                image_path: path.uuid,
                is_primary: primaryImageIndex == i ? 1 : 0,
                user_id: get().userId
            });
            if (primaryImageIndex == i) result = path.uuid;
        }
        set({ loading: false });
        set({ fetching: false });
        return result;
    },
    createListing: async (input: any) => {
        try {

            const userId = get().userId;
            const {
                be_listed, description, type, form, brand_id, model, model_year, fuel_type,
                transmission_type, variant, horsepower, color, service_book, km_status,
                condition_status, leasing_type, ownership_transferable, instant_takeover,
                payment, month_payment, lease_period, restvalue, discount, reserve_price,
                offer_validity, equipment, images, primaryImageIndex
            } = input;

            const res = await supabase
                .from('carlistings')
                .insert({
                    be_listed,
                    description,
                    type,
                    form,
                    brand_id,
                    model,
                    model_year,
                    fuel_type,
                    transmission_type,
                    variant,
                    horsepower,
                    color,
                    service_book,
                    km_status,
                    condition_status,
                    leasing_type,
                    ownership_transferable,
                    instant_takeover,
                    payment,
                    month_payment,
                    lease_period,
                    restvalue,
                    discount,
                    reserve_price,
                    offer_validity,
                    user_id: userId
                })
                .eq('user_id', userId)
                .select('listing_id')
                .single();
            if (res.error || !res.data.listing_id) return false;
            const listingId = res.data.listing_id;

            if (equipment && equipment.length) {
                const equipmentValues = equipment.map((id: any) => ({ listing_id: listingId, equipment_id: id }));
                const { error: insertError } = await supabase.from('carlistingequipment').insert(equipmentValues);
                if (insertError) {
                    return false;
                }
            }

            for (let i in images) {
                const img = images[i];
                const path = await fileUpload(img, 3000);
                await supabase.from('listingimages').insert({
                    listing_id: listingId,
                    image_path: path.uuid,
                    is_primary: primaryImageIndex == i ? 1 : 0,
                    user_id: get().userId
                })
            }
            return true;
        } catch (e) {
            console.error('Kunne ikke oprette opslag', e);
            return false;
        }
    }
}))