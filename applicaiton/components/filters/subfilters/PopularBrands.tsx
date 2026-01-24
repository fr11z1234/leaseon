import vw from '@/img/brands/vw.png';
import audi from '@/img/brands/audi.png';
import mercedes from '@/img/brands/mercedes.png';
import tesla from '@/img/brands/tesla.png';
import bmw from '@/img/brands/bmw.png';
import Image from 'next/image';

type PopularBrandsProps = {
    selectBrand: (brand: string) => void,
    selected: string[]
}


export default function ({ selectBrand, selected }: PopularBrandsProps) {
    const popular_brands = [
        { name: 'VW', img: vw, value: "VW" },
        { name: 'Audi', img: audi, value: "Audi" },
        { name: 'Mercedes', img: mercedes, value: "Mercedes" },
        { name: 'Tesla', img: tesla, value: "Telsa" },
        { name: 'BMW', img: bmw, value: "BMW" },
    ];

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-list text-dark">De mest Populære mærker</p>
            <div className="flex flex-wrap lg:flex-nowrap gap-2.5 lg:gap-0 lg:justify-between">
                {popular_brands.map((brand, index) => (
                    <div
                        key={index}
                        onClick={() => selectBrand(brand.value)}
                        className={`flex flex-col justify-center items-center w-[calc(33%-(20px/3))] lg:w-[110px] h-[91px] opacity-100 !border-border border-1 rounded hover:opacity-50 cursor-pointer gap-1 transition ${selected.includes(brand.value) && '!opacity-100 !border-blue-500 text-blue-500'
                            }`}
                    >
                        <Image src={brand.img} alt="VW" className="h-[40px] w-[40px]" unoptimized />
                        <p>{brand.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};