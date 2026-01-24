'use client';
import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '@/utils/img';

type ImageGalleryProps = {
    images: string[];
    primaryImage?: string;
};

const ImageGallery = ({ images, primaryImage }: ImageGalleryProps) => {
    // Check if a primary image is provided and use it; otherwise, default to the first image in the array
    const initialMainImage = primaryImage ? getImageUrl(primaryImage)
        : images && images.length > 0 ? getImageUrl(images[0])
            : null;

    if (!images || images.length === 0) {
        return <div>Intet billede tilgængelig</div>;
    }

    const [selectedImage, setSelectedImage] = useState(initialMainImage);

    return (
        <div className='flex flex-col items-center w-full max-w-full mx-auto'>
            {/* Main image */}
            {selectedImage && (
                <div className='w-full h-96 bg-gray-200 overflow-hidden'>
                    <Image priority={true} src={selectedImage} height={384} width={700} alt='Main Car' className='w-full h-full object-contain rounded-sm sm:object-fit' unoptimized />
                </div>
            )}
            {/* Thumbnails */}
            <div className='flex mt-2 gap-2 w-full flex-wrap'>
                {images.map((image, index) => (
                    <div key={index} className='w-custom-fourth overflow-hidden rounded-sm'>
                        <Image
                            priority={true}
                            width={125}
                            height={90}
                            src={getImageUrl(image)}
                            alt={`Thumbnail ${index + 1}`}
                            className='object-cover w-full h-full cursor-pointer'
                            onClick={() => setSelectedImage(getImageUrl(image))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
