import imageCompression from 'browser-image-compression';
import { supabase } from './supabase/server';

export const resizeImage = async (file: File, maxSizeKb = 500) => {
    const options = {
        maxSizeMB: maxSizeKb / 1000, // Convert KB to MB
        maxWidthOrHeight: 1920, // Resize to a max width/height
        useWebWorker: true, // Use a web worker for better performance
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};

export const fileUpload = async (file: File, compression = 500) => {
    const compressedFile = await resizeImage(file, compression);
    
    // Generate unique filename
    const uuid = crypto.randomUUID();
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuid}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    return { uuid: filePath };
};

// Helper function to get public URL for an image
export const getImageUrl = (path: string) => {
    // If it's already a full URL, return it
    if (path.startsWith('http')) {
        return path;
    }
    
    // Get public URL from Supabase Storage
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path);
    
    return data.publicUrl;
};