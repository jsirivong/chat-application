export interface RegisterData {
    [key: string]: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface CompleteProfileData {
    first_name: string;
    last_name: string;
    bio: string;
    native_language: string;
    location: string;
}