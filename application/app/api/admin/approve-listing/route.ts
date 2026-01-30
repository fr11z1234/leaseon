import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase Storage URL for images
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/images`;

interface ListingData {
    listing_id: number;
    model: string;
    variant?: string;
    model_year: number;
    discount: number;
    payment?: number;
    month_payment?: number;
    km_status?: number;
    fuel_type?: string;
    brand_name?: string;
    carbrands?: { brand_name: string };
    listingimages?: { image_path: string; is_primary: number }[];
}

/**
 * Get the primary image URL for a listing
 */
function getPrimaryImageUrl(listing: ListingData): string | null {
    if (!listing.listingimages || listing.listingimages.length === 0) {
        return null;
    }

    const primaryImage = listing.listingimages.find(img => img.is_primary === 1);
    const imagePath = primaryImage?.image_path || listing.listingimages[0]?.image_path;

    if (!imagePath) return null;

    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Build Supabase storage URL
    return `${SUPABASE_STORAGE_URL}/${imagePath}`;
}

/**
 * Add listing to Facebook post queue for n8n webhook
 */
async function addToPostQueue(
    supabase: ReturnType<typeof createClient>,
    listing: ListingData
): Promise<{ success: boolean; queueId?: number; error?: string }> {
    const brandName = listing.brand_name || listing.carbrands?.brand_name || 'Ukendt';
    const listingUrl = `https://leaseon.dk/biler/${listing.listing_id}`;
    const primaryImageUrl = getPrimaryImageUrl(listing);

    const { data, error } = await supabase
        .from('fb_post_queue')
        .insert({
            listing_id: listing.listing_id,
            brand_name: brandName,
            model: listing.model,
            variant: listing.variant || '',
            model_year: listing.model_year,
            discount: listing.discount,
            payment: listing.payment || 0,
            month_payment: listing.month_payment || 0,
            km_status: listing.km_status || 0,
            fuel_type: listing.fuel_type || '',
            listing_url: listingUrl,
            primary_image_url: primaryImageUrl,
            status: 'pending'
        })
        .select('id')
        .single();

    if (error) {
        console.error('Failed to add to post queue:', error);
        return { success: false, error: error.message };
    }

    return { success: true, queueId: data?.id };
}

/**
 * Verify that the current user is an admin
 */
async function verifyAdmin(supabase: ReturnType<typeof createClient>, authHeader: string | null): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { isAdmin: false, error: 'No authorization token provided' };
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return { isAdmin: false, error: 'Invalid or expired token' };
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

    if (profileError || !profile?.is_admin) {
        return { isAdmin: false, error: 'User is not an admin' };
    }

    return { isAdmin: true, userId: user.id };
}

/**
 * POST /api/admin/approve-listing
 * Approve a listing and add to Facebook post queue for n8n webhook
 */
export async function POST(request: NextRequest) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin status
    const authHeader = request.headers.get('authorization');
    const { isAdmin, error: authError } = await verifyAdmin(supabase, authHeader);

    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Get listing ID from request body
    const body = await request.json();
    const { listingId, action } = body;

    if (!listingId) {
        return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
    }

    if (!action || !['approve', 'reject'].includes(action)) {
        return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
    }

    // Fetch the listing with images
    const { data: listing, error: fetchError } = await supabase
        .from('carlistings')
        .select('*, carbrands(brand_name), listingimages(image_path, is_primary)')
        .eq('listing_id', listingId)
        .single();

    if (fetchError || !listing) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (action === 'reject') {
        // Simply update status to rejected
        const { error: updateError } = await supabase
            .from('carlistings')
            .update({ fb_approval_status: 'rejected' })
            .eq('listing_id', listingId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update listing status' }, { status: 500 });
        }

        return NextResponse.json({ success: true, status: 'rejected' });
    }

    // Action is 'approve' - add to post queue for n8n webhook
    const queueResult = await addToPostQueue(supabase, listing as ListingData);

    if (!queueResult.success) {
        return NextResponse.json({
            error: `Failed to add to post queue: ${queueResult.error}`,
        }, { status: 500 });
    }

    // Update listing status to posted (queued for posting)
    const { error: updateError } = await supabase
        .from('carlistings')
        .update({
            fb_approval_status: 'posted',
            fb_posted_at: new Date().toISOString()
        })
        .eq('listing_id', listingId);

    if (updateError) {
        console.error('Failed to update listing status:', updateError);
    }

    return NextResponse.json({
        success: true,
        status: 'queued',
        queueId: queueResult.queueId
    });
}

/**
 * GET /api/admin/approve-listing
 * Get all pending listings for approval
 */
export async function GET(request: NextRequest) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin status
    const authHeader = request.headers.get('authorization');
    const { isAdmin, error: authError } = await verifyAdmin(supabase, authHeader);

    if (!isAdmin) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Fetch pending listings
    const { data: listings, error } = await supabase
        .from('carlistings')
        .select('*, carbrands(brand_name), listingimages(image_path, is_primary)')
        .eq('fb_approval_status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }

    // Transform the data
    const transformedListings = listings?.map(listing => ({
        ...listing,
        brand_name: listing.carbrands?.brand_name || 'Ukendt',
        primary_image: listing.listingimages?.find((img: any) => img.is_primary)?.image_path
            || listing.listingimages?.[0]?.image_path
            || null
    }));

    return NextResponse.json({ listings: transformedListings });
}
