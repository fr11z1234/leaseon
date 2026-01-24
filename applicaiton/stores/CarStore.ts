import { Equipment } from '@/types/Equipment'
import { create } from 'zustand'
import { supabase } from '../utils/supabase/server'

type Brand = { value: string, label: string, id: number }

type State = {
    brands: Brand[]
    equipment: Equipment[]
    models: { value: string, label: string }[]
}

type Actions = {
    fetchBrands: (refresh: boolean) => void
    fetchModels: (brand: Brand) => void
    fetchMultipleModels: (brands: string[]) => void
    fetchEquipment: () => void
}

export const carStore = create<State & Actions>((set, get) => ({
    brands: [],
    equipment: [],
    models: [],
    fetchBrands: async (refresh = false) => {
        if (!refresh && get().brands.length > 0) return;

        const { data: carbrands, error } = await supabase.from('carbrands').select();

        if (error) {
            set({ brands: [] });
            return;
        }

        const brands = carbrands?.map((brand: { brand_name: string, brand_id: number }) => ({ value: brand.brand_name, label: brand.brand_name, id: brand.brand_id })) || [];
        set({ brands });
    },
    fetchModels: async (brand) => {
        set({ models: [] });
        const { data, error } = await supabase
            .rpc('get_car_models_by_brand', { brand_name_param: brand });

        if (error) {
            set({ models: [] });
            return;
        }

        const modelOptions = data.map((model: { model: string }) => ({ value: model.model, label: model.model }));
        set({ models: modelOptions });
    },
    fetchMultipleModels: async (brands) => {
        set({ models: [] });
        for (let i = 0; i < brands.length; i++) {
            const brand = brands[i];

            const { data, error } = await supabase
                .rpc('get_car_models_by_brand', { brand_name_param: brand });

            if (error) {
                set({ models: [] });
                return;
            }

            const modelOptions = data.map((model: { model: string }) => ({ value: model.model, label: model.model }));
            set({ models: [...get().models, modelOptions] });

        }
    },
    fetchEquipment: async () => {
        const { data: equipments, error } = await supabase.from('equipment').select();

        if (error) {
            set({ equipment: [] });
            return;
        }

        const sortedEquipment = equipments.sort((a: Equipment, b: Equipment) => a.name.localeCompare(b.name));
        set({ equipment: sortedEquipment });
    }
}))