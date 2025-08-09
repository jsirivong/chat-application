export default interface User {
    readonly id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profile_picture: string;
    native_language: string;
    location: string;
    is_on_boarded: boolean;
    friends: number[];
    created_at: Date;
    updated_at: Date;
}