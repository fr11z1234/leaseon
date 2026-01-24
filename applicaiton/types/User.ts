
export type User = {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phone: string
    city: string
    facebookProfile: string
    profilePicture?: File
}
export default function (): User {
    return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        city: '',
        facebookProfile: '',
    }
}