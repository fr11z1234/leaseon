import Checkbox from "@/components/Pages/Shared/CheckBox";

type FuelTypeProps = {
    fuel_types: { value: string, label: string }[],
    selected_types: string[],
    select: (type: string) => void
}

export default function ({ fuel_types, selected_types, select }: FuelTypeProps) {
    return (
        <div className="flex flex-col gap-2.5 w-1/2">
            <p className="text-text text-dark">Drivmiddel</p>
            {fuel_types.map((fuel, index) => (
                <Checkbox key={index} modelValue={selected_types.includes(fuel.value)} label={fuel.label} onUpdateModelValue={() => select(fuel.value)} />
            ))}
        </div>
    );
}