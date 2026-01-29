import sedan from '@/img/types/sedan.svg';
import coupe from '@/img/types/coupe.svg';
import cabriolet from '@/img/types/cabriolet.svg';
import crossover from '@/img/types/crossover.svg';
import hatchback from '@/img/types/hatchback.svg';
import stationcar from '@/img/types/stationcar.svg';
import suv from '@/img/types/suv.svg';
import van from '@/img/types/van.svg';
import Image from 'next/image';

type CarTypeProps = {
    selectType: (type: string) => void,
    selected: string[]
}

export default function ({ selectType, selected }: CarTypeProps) {
    const car_types = [
        { value: 'sedan', label: 'Sedan', icon: sedan, id: 'Sedan' },
        { value: 'coupe', label: 'Coupe', icon: coupe, id: 'Coupe' },
        { value: 'cabriolet', label: 'Cabriolet', icon: cabriolet, id: 'Cabriolet' },
        { value: 'crossover', label: 'Crossover', icon: crossover, id: 'Crossover' },
        { value: 'hatchback', label: 'Hatchback', icon: hatchback, id: 'Hatchback' },
        { value: 'stationcar', label: 'Stationcar', icon: stationcar, id: 'Stationcar' },
        { value: 'suv', label: 'SUV', icon: suv, id: 'SUV' },
        { value: 'van', label: 'Van', icon: van, id: 'Van' },
    ];

    return (
        <div className="flex flex-col gap-[30px]">
            <div className="flex justify-between pb-[30px]">
                <div className="flex flex-wrap gap-5 w-full lg:w-[1140px]">
                    {car_types.map((type, index) => (
                        <div
                            key={index}
                            onClick={() => selectType(type.id)}
                            className={`cursor-pointer flex flex-col h-24 w-[calc(50%-10px)] lg:w-[calc(25%-(60px/4))] rounded justify-center items-center gap-1 border-1 !border-border hover:!border-dark-faded transition opacity-50 hover:opacity-70 ${selected.includes(type.id) && '!opacity-100 !border-blue-500 text-blue-500 hover:!border-primary'
                                }`}
                        >
                            <Image src={type.icon} className="w-16 h-9 text-dark" alt={type.value} unoptimized />
                            <p className="text-text text-dark">{type.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}