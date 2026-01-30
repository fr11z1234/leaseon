import { create } from 'zustand';
import { supabase } from '../utils/supabase/server';
import { Listing } from '@/types/Listing';

type AdminState = {
    isAdmin: boolean;
    isChecking: boolean;
    pendingListings: Listing[];
    loading: boolean;
    error: string | null;
};

type AdminActions = {
    checkAdminStatus: () => Promise<boolean>;
    fetchPendingListings: () => Promise<void>;
    approveListing: (listingId: number) => Promise<{ success: boolean; error?: string }>;
    rejectListing: (listingId: number) => Promise<{ success: boolean; error?: string }>;
};

async function getAuthToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
}

export const adminStore = create<AdminState & AdminActions>((set, get) => ({
    isAdmin: false,
    isChecking: true,
    pendingListings: [],
    loading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isChecking: true });

        try {
            const { data: session } = await supabase.auth.getSession();

            if (!session?.session?.user) {
                set({ isAdmin: false, isChecking: false });
                return false;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('user_id', session.session.user.id)
                .single();

            if (error || !profile?.is_admin) {
                set({ isAdmin: false, isChecking: false });
                return false;
            }

            set({ isAdmin: true, isChecking: false });
            return true;
        } catch (e) {
            console.error('Error checking admin status:', e);
            set({ isAdmin: false, isChecking: false });
            return false;
        }
    },

    fetchPendingListings: async () => {
        set({ loading: true, error: null });

        try {
            const token = await getAuthToken();

            if (!token) {
                set({ loading: false, error: 'Ikke logget ind' });
                return;
            }

            const response = await fetch('/api/admin/approve-listing', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                set({ loading: false, error: data.error || 'Kunne ikke hente annoncer' });
                return;
            }

            set({ pendingListings: data.listings || [], loading: false });
        } catch (e) {
            console.error('Error fetching pending listings:', e);
            set({ loading: false, error: 'Netværksfejl' });
        }
    },

    approveListing: async (listingId: number) => {
        set({ loading: true, error: null });

        try {
            const token = await getAuthToken();

            if (!token) {
                set({ loading: false });
                return { success: false, error: 'Ikke logget ind' };
            }

            const response = await fetch('/api/admin/approve-listing', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listingId, action: 'approve' })
            });

            const data = await response.json();
            set({ loading: false });

            if (!response.ok) {
                return { success: false, error: data.error || 'Kunne ikke godkende annonce' };
            }

            // Remove the listing from pending list
            const currentListings = get().pendingListings;
            set({ pendingListings: currentListings.filter(l => l.listing_id !== listingId) });

            return { success: true };
        } catch (e) {
            console.error('Error approving listing:', e);
            set({ loading: false });
            return { success: false, error: 'Netværksfejl' };
        }
    },

    rejectListing: async (listingId: number) => {
        set({ loading: true, error: null });

        try {
            const token = await getAuthToken();

            if (!token) {
                set({ loading: false });
                return { success: false, error: 'Ikke logget ind' };
            }

            const response = await fetch('/api/admin/approve-listing', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listingId, action: 'reject' })
            });

            const data = await response.json();
            set({ loading: false });

            if (!response.ok) {
                return { success: false, error: data.error || 'Kunne ikke afvise annonce' };
            }

            // Remove the listing from pending list
            const currentListings = get().pendingListings;
            set({ pendingListings: currentListings.filter(l => l.listing_id !== listingId) });

            return { success: true };
        } catch (e) {
            console.error('Error rejecting listing:', e);
            set({ loading: false });
            return { success: false, error: 'Netværksfejl' };
        }
    }
}));
