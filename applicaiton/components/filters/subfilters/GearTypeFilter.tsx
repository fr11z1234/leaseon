import Checkbox from "@/components/Pages/Shared/CheckBox";

type GearTypeProps = {
    gear_types: { value: string, label: string }[],
    selected_types: string[],
    select: (type: string) => void
}

export default function ({ gear_types, selected_types, select }: GearTypeProps) {
    return (
        <div className="flex flex-col gap-2.5 w-1/2">
            <p className="text-text text-dark">Geartype</p>
            {gear_types.map((gear, index) => (
                <Checkbox key={index} modelValue={selected_types.includes(gear.value)} label={gear.label} onUpdateModelValue={() => select(gear.value)} />
            ))}
        </div>
    );
};