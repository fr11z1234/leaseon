'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { adminStore } from '@/stores/AdminStore';
import { getImageUrl } from '@/utils/img';
import LoaderDark from '@/components/LoaderDark';
import EventEmitter from '@/EventEmitter';

export default function AdminGodkendelser() {
    const router = useRouter();
    const isAdmin = adminStore((s) => s.isAdmin);
    const isChecking = adminStore((s) => s.isChecking);
    const pendingListings = adminStore((s) => s.pendingListings);
    const loading = adminStore((s) => s.loading);
    const error = adminStore((s) => s.error);

    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        adminStore.getState().checkAdminStatus().then((isAdmin) => {
            if (isAdmin) {
                adminStore.getState().fetchPendingListings();
            }
        });
    }, []);

    const handleApprove = async (listingId: number) => {
        setProcessingId(listingId);
        const result = await adminStore.getState().approveListing(listingId);
        setProcessingId(null);

        if (result.success) {
            EventEmitter.emit('notify', 'Annonce godkendt og tilføjet til kø');
        } else {
            EventEmitter.emit('notify', `Fejl: ${result.error}`);
        }
    };

    const handleReject = async (listingId: number) => {
        setProcessingId(listingId);
        const result = await adminStore.getState().rejectListing(listingId);
        setProcessingId(null);

        if (result.success) {
            EventEmitter.emit('notify', 'Annonce afvist');
        } else {
            EventEmitter.emit('notify', `Fejl: ${result.error}`);
        }
    };

    const getListingImage = (listing: any) => {
        if (listing.primary_image) {
            return getImageUrl(listing.primary_image);
        }
        if (listing.listingimages && listing.listingimages.length > 0) {
            const primaryImg = listing.listingimages.find((img: any) => img.is_primary);
            const imagePath = primaryImg?.image_path || listing.listingimages[0]?.image_path;
            if (imagePath) return getImageUrl(imagePath);
        }
        return null;
    };

    // Show loading while checking admin status
    if (isChecking) {
        return (
            <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen pt-24">
                <Head>
                    <title>Admin - Leaseon.dk</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <LoaderDark />
            </div>
        );
    }

    // Show access denied if not admin
    if (!isAdmin) {
        return (
            <div className="flex flex-col w-full items-center justify-center bg-custom-background min-h-screen pt-24">
                <Head>
                    <title>Adgang nægtet - Leaseon.dk</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="bg-white rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Adgang nægtet</h1>
                    <p className="text-gray-600 mb-6">Du har ikke adgang til denne side. Log ind som administrator.</p>
                    <Link href="/dashboard" className="primary-button">
                        Gå til dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full items-center bg-custom-background min-h-screen pt-24 sm:pt-32 pb-12">
            <Head>
                <title>Facebook Godkendelser - Admin - Leaseon.dk</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="w-full max-w-[1200px] px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Facebook Godkendelser</h1>
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        {pendingListings.length} venter
                    </span>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading && !processingId && (
                    <div className="flex justify-center py-12">
                        <LoaderDark />
                    </div>
                )}

                {!loading && pendingListings.length === 0 && (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-medium text-gray-600">Ingen annoncer venter på godkendelse</h2>
                        <p className="text-gray-400 mt-2">Nye annoncer med præmie vil dukke op her.</p>
                    </div>
                )}

                <div className="grid gap-6">
                    {pendingListings.map((listing: any) => {
                        const imageUrl = getListingImage(listing);
                        const isProcessing = processingId === listing.listing_id;

                        return (
                            <div
                                key={listing.listing_id}
                                className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isProcessing ? 'opacity-50' : ''}`}
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={`${listing.brand_name} ${listing.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                Intet billede
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-xl font-bold text-slate-900">
                                                        {listing.brand_name} {listing.model}
                                                    </h2>
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                                        Afventer
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 mb-3">
                                                    {listing.variant} - {listing.model_year} - {listing.fuel_type}
                                                </p>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Præmie</span>
                                                        <p className="font-bold text-green-600">
                                                            {(listing.discount ?? 0).toLocaleString('da-DK')} kr.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Udbetaling</span>
                                                        <p className="font-medium">
                                                            {(listing.payment ?? 0).toLocaleString('da-DK')} kr.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Mnd. ydelse</span>
                                                        <p className="font-medium">
                                                            {(listing.month_payment ?? 0).toLocaleString('da-DK')} kr.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Kilometer</span>
                                                        <p className="font-medium">
                                                            {(listing.km_status ?? 0).toLocaleString('da-DK')} km
                                                        </p>
                                                    </div>
                                                </div>

                                                {listing.description && (
                                                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                                                        {listing.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-row md:flex-col gap-3 pt-2 md:pt-0">
                                                <button
                                                    onClick={() => handleApprove(listing.listing_id)}
                                                    disabled={isProcessing}
                                                    className="flex-1 md:flex-none px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isProcessing ? (
                                                        <LoaderDark />
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Godkend
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(listing.listing_id)}
                                                    disabled={isProcessing}
                                                    className="flex-1 md:flex-none px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Afvis
                                                </button>
                                                <Link
                                                    href={`/biler/${listing.listing_id}`}
                                                    target="_blank"
                                                    className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-center"
                                                >
                                                    Se annonce
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data der sendes til n8n */}
                                <div className="border-t border-gray-200 bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500 mb-2 font-medium">Data til n8n kø:</p>
                                    <div className="bg-white border border-gray-200 rounded p-3 text-xs text-gray-600 font-mono">
                                        <p>brand_name: {listing.brand_name}</p>
                                        <p>model: {listing.model} | variant: {listing.variant}</p>
                                        <p>model_year: {listing.model_year} | discount: {listing.discount}</p>
                                        <p>listing_url: https://leaseon.dk/biler/{listing.listing_id}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
