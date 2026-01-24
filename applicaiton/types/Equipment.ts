export type Equipment = {
    equipment_id: number
    name: string
    icon: string
}

export default function (): Equipment {
    return ({
        equipment_id: 0,
        name: '',
        icon: ''
    })
}