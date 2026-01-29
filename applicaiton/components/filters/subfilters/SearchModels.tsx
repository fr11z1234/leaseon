import { carStore } from "@/stores/CarStore";
import { useEffect, useState } from "react";

type SearchModelsProps = {
    selectModel: (model: string) => void,
    selected_models: string[],
    selected_brand: string[]
}

export default function ({ selectModel, selected_models, selected_brand }: SearchModelsProps) {
    const models = carStore(s => s.models);
    const [search, setSearch] = useState("");

    // Fetch models for the selected brand
    useEffect(() => {
        if (selected_brand.length) {
            carStore.getState().fetchMultipleModels(selected_brand as any);
        } else {
            carStore.setState({ models: [] });
        }
    }, [selected_brand]);

    const search_models = models.filter(
        model => selected_models.includes(model?.value) || model?.value?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-list text-dark">Søg efter model</p>
            <input
                placeholder="Indtast Model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-own w-full"
            />
            <div className="flex flex-wrap gap-2.5">
                {search_models.map((model, index) => (
                    <div
                        key={index}
                        onClick={() => selectModel(model.value)}
                        className={`flex flex-col justify-center items-center w-[calc(50%-8px)] md:w-[calc(100%/5-8px)] h-[55px] opacity-40 border-border border rounded hover:opacity-70 cursor-pointer gap-1 transition ${selected_models.includes(model.value) && '!opacity-100 !border-blue-500 text-blue-500'
                            }`}
                    >
                        <p>{model.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}