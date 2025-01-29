export interface User {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    role: 'user' | 'admin';
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }