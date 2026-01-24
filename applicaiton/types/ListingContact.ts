export type ListingContact = {
    first_name: string
    last_name: string
    phone: string
    email: string
    facebook_profile: string
}

export default function (): ListingContact {
    return ({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        facebook_profile: ''
    })
}