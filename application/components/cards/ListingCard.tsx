import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { getImageUrl } from '@/utils/img';

const ListingCard = ({ car }: any) => {
  if (!car) {
    return 'Loading...';
  }

  const urlString = () => {
    if (!car || !car.brand_name) {
      return '';
    }
    const name = car.brand_name.toLowerCase().replace(/\s+/g, '-');
    const model = car.model.toLowerCase().replace(/\s+/g, '-');
    const variant = car.variant.toLowerCase().replace(/\s+/g, '-');
    const fuel_type = car.fuel_type.toLowerCase().replace(/\s+/g, '-');
    const year = car.model_year;
    const id = car.listing_id;
    return name + '-' + model + '-' + variant + '-' + year + '-' + fuel_type + '-' + id;
  }

  const bgImage = () => {
    if (!car.listingimages || car.listingimages.length === 0) {
      return { backgroundImage: 'url()' };
    }

    // Find primary image (is_primary = 1) or fallback to first image
    const primaryImage = car.listingimages.find((image: any) => image.is_primary === 1 || image.is_primary === true);
    const firstImage = car.listingimages[0];
    const imagePath = primaryImage?.image_path || firstImage?.image_path || null;
    
    if (!imagePath) return { backgroundImage: 'url()' };
    return { backgroundImage: `url(${getImageUrl(imagePath)})` };
  }

  return (

    <Link href={`/biler/${urlString()}`} prefetch={true}
      className="flex flex-col w-[90%] sm:max-w-[47%] lg:max-w-[24%] h-auto rounded overflow-hidden bg-slate-900 group hover:scale-105 transition ease-in duration-100 cursor-pointer">
      <div className="w-full h-[230px] relative bg-slate-700 bg-cover bg-center" style={bgImage()}>
        <div className="flex absolute bg-emerald-100 rounded px-2.5 right-2 top-2">
          <p className="text-green-500 text-reward font-bold py-1">💸 {(car.discount ?? 0).toLocaleString('dk-DK')} DKK</p>
        </div>
      </div>

      <div className="flex flex-col p-5 gap-1">
        <h4 className="text-lg text-white sm:text-lg">{car.brand_name}</h4>
        <h5 className="text-sm text-white">{car.model} {car.variant}</h5>
        <h3 className="text-card text-white"> {((car.payment - car.discount) ?? 0).toLocaleString('de-DE')} DKK <span
          className="text-text opacity-20 line-through">{(car.payment ?? 0).toLocaleString('de-DE')} DKK</span>
        </h3>
      </div>

      <div className="flex p-5 border-y border-y-white border-opacity-20">
        <div className="w-full flex flex-col justify-center items-center">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_101_295)">
              <path
                d="M5.61462 4.58594L4.59509 7.5H16.0717L15.0521 4.58594C14.8763 4.08594 14.4037 3.75 13.8724 3.75H6.79431C6.26306 3.75 5.79041 4.08594 5.61462 4.58594ZM1.88025 7.6875L3.25525 3.76172C3.78259 2.25781 5.20056 1.25 6.79431 1.25H13.8724C15.4662 1.25 16.8842 2.25781 17.4115 3.76172L18.7865 7.6875C19.6927 8.0625 20.3334 8.95703 20.3334 10V15.625V17.5C20.3334 18.1914 19.7748 18.75 19.0834 18.75H17.8334C17.142 18.75 16.5834 18.1914 16.5834 17.5V15.625H4.08337V17.5C4.08337 18.1914 3.52478 18.75 2.83337 18.75H1.58337C0.891968 18.75 0.333374 18.1914 0.333374 17.5V15.625V10C0.333374 8.95703 0.973999 8.0625 1.88025 7.6875ZM5.33337 11.25C5.33337 10.9185 5.20168 10.6005 4.96726 10.3661C4.73284 10.1317 4.41489 10 4.08337 10C3.75185 10 3.43391 10.1317 3.19949 10.3661C2.96507 10.6005 2.83337 10.9185 2.83337 11.25C2.83337 11.5815 2.96507 11.8995 3.19949 12.1339C3.43391 12.3683 3.75185 12.5 4.08337 12.5C4.41489 12.5 4.73284 12.3683 4.96726 12.1339C5.20168 11.8995 5.33337 11.5815 5.33337 11.25ZM16.5834 12.5C16.9149 12.5 17.2328 12.3683 17.4673 12.1339C17.7017 11.8995 17.8334 11.5815 17.8334 11.25C17.8334 10.9185 17.7017 10.6005 17.4673 10.3661C17.2328 10.1317 16.9149 10 16.5834 10C16.2519 10 15.9339 10.1317 15.6995 10.3661C15.4651 10.6005 15.3334 10.9185 15.3334 11.25C15.3334 11.5815 15.4651 11.8995 15.6995 12.1339C15.9339 12.3683 16.2519 12.5 16.5834 12.5Z"
                fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_101_295">
                <rect width="20" height="20" fill="white" transform="translate(0.333374)" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-list-attr text-white">{(car.km_status ?? 0).toLocaleString('de-DE')} km</p>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.9991 1H2.57166V21H13.9991V1Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round"
              strokeLinejoin="round" />
            <path d="M11.8576 3.14258H4.71472V8.85686H11.8576V3.14258Z" stroke="white" strokeMiterlimit="10"
              strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.71472 10.9998H11.8576" stroke="white" strokeMiterlimit="10" strokeLinecap="round"
              strokeLinejoin="round" />
            <path d="M1.14282 21H15.4288" stroke="white" strokeMiterlimit="10" strokeLinecap="round"
              strokeLinejoin="round" />
            <path
              d="M15.4292 5.28564C16.2172 5.28564 16.8572 5.9245 16.8572 6.71393V16.7139C16.8572 17.1079 16.5375 17.4276 16.1424 17.4276C15.7489 17.4276 15.4292 17.1079 15.4292 16.7139V12.4285C15.4292 11.6388 14.7892 10.9996 13.9995 10.9996"
              stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <p className="text-list-attr text-white text-center">{car.fuel_type}</p>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M6.14988 14.5581V12.0943C6.14988 12.0413 6.17095 11.9904 6.20846 11.9529C6.24597 11.9154 6.29684 11.8943 6.34988 11.8943H8.72511C8.77815 11.8943 8.82903 11.9154 8.86653 11.9529C8.90404 11.9904 8.92511 12.0413 8.92511 12.0943V16.7584C8.92511 17.9964 9.92872 19 11.1667 19C12.4047 19 13.4084 17.9964 13.4084 16.7584V12.0943C13.4084 12.0413 13.4294 11.9904 13.4669 11.9529C13.5044 11.9154 13.5553 11.8943 13.6084 11.8943H15.9836C16.0366 11.8943 16.0875 11.9154 16.125 11.9529C16.1625 11.9904 16.1836 12.0413 16.1836 12.0943V16.7584C16.1836 17.9964 17.1872 19 18.4252 19C19.6632 19 20.6668 17.9966 20.6668 16.7586V2.24162C20.6668 1.00361 19.6632 0 18.4252 0C17.1872 0 16.1836 1.00361 16.1836 2.24162V6.90567C16.1836 6.95871 16.1625 7.00958 16.125 7.04709C16.0875 7.0846 16.0366 7.10567 15.9836 7.10567H13.6084C13.5553 7.10567 13.5044 7.0846 13.4669 7.04709C13.4294 7.00958 13.4084 6.95871 13.4084 6.90567V2.24162C13.4084 1.00361 12.4047 0 11.1667 0C9.92872 0 8.92511 1.00361 8.92511 2.24162V6.90567C8.92511 6.95871 8.90404 7.00958 8.86653 7.04709C8.82903 7.0846 8.77815 7.10567 8.72511 7.10567H6.34988C6.29684 7.10567 6.24597 7.0846 6.20846 7.04709C6.17095 7.00958 6.14988 6.95871 6.14988 6.90567V2.24162C6.14988 1.00361 5.14627 0 3.90826 0C2.67025 0 1.66664 1.00361 1.66664 2.24162V14.4761C1.05063 15.0594 0.666626 15.8848 0.666626 16.8C0.666626 18.5674 2.09924 20 3.86666 20C5.63408 20 7.06669 18.5674 7.06669 16.8C7.06669 15.9268 6.71689 15.1354 6.14988 14.5581ZM3.26665 13.6561C3.46446 13.6187 3.66535 13.6 3.86666 13.6001C4.10106 13.6001 4.32966 13.6253 4.54987 13.6731V12.0945C4.54987 11.6171 4.73951 11.1593 5.07708 10.8217C5.41465 10.4841 5.87249 10.2945 6.34988 10.2945H8.72511C9.2025 10.2945 9.66035 10.4841 9.99791 10.8217C10.3355 11.1593 10.5251 11.6171 10.5251 12.0945V16.7586C10.5251 16.9287 10.5927 17.0919 10.713 17.2123C10.8334 17.3326 10.9966 17.4002 11.1667 17.4002C11.3369 17.4002 11.5001 17.3326 11.6204 17.2123C11.7407 17.0919 11.8083 16.9287 11.8083 16.7586V12.0945C11.8083 11.6171 11.998 11.1593 12.3356 10.8217C12.6731 10.4841 13.131 10.2945 13.6084 10.2945H15.9836C16.461 10.2945 16.9188 10.4841 17.2564 10.8217C17.594 11.1593 17.7836 11.6171 17.7836 12.0945V16.7586C17.7836 16.9287 17.8512 17.0919 17.9715 17.2123C18.0919 17.3326 18.255 17.4002 18.4252 17.4002C18.5954 17.4002 18.7586 17.3326 18.8789 17.2123C18.9992 17.0919 19.0668 16.9287 19.0668 16.7586V2.24162C19.0668 2.07146 18.9992 1.90826 18.8789 1.78794C18.7586 1.66761 18.5954 1.60002 18.4252 1.60002C18.255 1.60002 18.0919 1.66761 17.9715 1.78794C17.8512 1.90826 17.7836 2.07146 17.7836 2.24162V6.90567C17.7836 7.38306 17.594 7.84091 17.2564 8.17847C16.9188 8.51604 16.461 8.70569 15.9836 8.70569H13.6084C13.131 8.70569 12.6731 8.51604 12.3356 8.17847C11.998 7.84091 11.8083 7.38306 11.8083 6.90567V2.24162C11.8083 2.15737 11.7917 2.07393 11.7595 1.99609C11.7273 1.91825 11.68 1.84752 11.6204 1.78794C11.5608 1.72836 11.4901 1.6811 11.4123 1.64886C11.3344 1.61661 11.251 1.60002 11.1667 1.60002C11.0825 1.60002 10.999 1.61661 10.9212 1.64886C10.8434 1.6811 10.7726 1.72836 10.713 1.78794C10.6535 1.84752 10.6062 1.91825 10.574 1.99609C10.5417 2.07393 10.5251 2.15737 10.5251 2.24162V6.90567C10.5251 7.38306 10.3355 7.84091 9.99791 8.17847C9.66035 8.51604 9.2025 8.70569 8.72511 8.70569H6.34988C5.87249 8.70569 5.41465 8.51604 5.07708 8.17847C4.73951 7.84091 4.54987 7.38306 4.54987 6.90567V2.24162C4.54987 2.07146 4.48227 1.90826 4.36194 1.78794C4.24162 1.66761 4.07842 1.60002 3.90826 1.60002C3.7381 1.60002 3.5749 1.66761 3.45458 1.78794C3.33425 1.90826 3.26665 2.07146 3.26665 2.24162V13.6561ZM5.46668 16.8002C5.46668 17.2245 5.2981 17.6315 4.99804 17.9315C4.69798 18.2316 4.29101 18.4002 3.86666 18.4002C3.44231 18.4002 3.03534 18.2316 2.73528 17.9315C2.43522 17.6315 2.26664 17.2245 2.26664 16.8002C2.26664 16.3758 2.43522 15.9688 2.73528 15.6688C3.03534 15.3687 3.44231 15.2002 3.86666 15.2002C4.29101 15.2002 4.69798 15.3687 4.99804 15.6688C5.2981 15.9688 5.46668 16.3758 5.46668 16.8002Z"
              fill="white" />
          </svg>

          <p className="text-list-attr text-white text-center">{car.transmission_type}</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full h-[66px] px-5">
        <h4 className="text-list text-white">{(car.month_payment ?? 0).toLocaleString('de-DE')} DKK / Mnd</h4>
        <svg className="group-hover:translate-x-1 transition" width="24" height="20" viewBox="0 0 24 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.5017 11.1766C24.166 10.5258 24.166 9.46896 23.5017 8.81817L14.9978 0.488091C14.3334 -0.162697 13.2545 -0.162697 12.5901 0.488091C11.9258 1.13888 11.9258 2.19576 12.5901 2.84654L18.1974 8.33398H1.8912C0.950464 8.33398 0.19043 9.07848 0.19043 10C0.19043 10.9215 0.950464 11.666 1.8912 11.666H18.1921L12.5955 17.1535C11.9311 17.8042 11.9311 18.8611 12.5955 19.5119C13.2598 20.1627 14.3388 20.1627 15.0031 19.5119L23.507 11.1818L23.5017 11.1766Z"
            fill="#FEFEFE" />
        </svg>

      </div>
    </Link >
  );
};

ListingCard.propTypes = {
  car: PropTypes.object.isRequired,
};

export default ListingCard;



