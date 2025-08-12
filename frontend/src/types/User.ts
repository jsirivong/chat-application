export default interface User {
    readonly id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    bio: string;
    profile_picture: string;
    native_language: string;
    location: string;
    completed_profile: boolean;
    friends: number[];
    created_at: Date;
    updated_at: Date;
}