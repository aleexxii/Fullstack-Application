

export interface User {
    id : string;
    email : string;
    name : string;
    role : 'admin' | 'user';
    profilePicture : string
}

export interface AuthState {
    user : User | null;
    isLoading : boolean;
    error : string | null
}

export interface LoginCredentials {
    email : string;
    password : string
}

export interface LoginResponse {
    user : User
}