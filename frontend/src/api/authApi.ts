import axios from 'axios';


const API_URL = 'http://localhost:7000/auth';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

console.log('api :>> ', api);

export const register = async (username: string, email: string, password: string) => {
  return api.post(`/register`, {
    username,
    email,
    password,
  });
};

export const login = async (email: string, password: string) => {
  return api.post(`/login`, {
    email,
    password,
  });
};

export const logout = async () => { 
  return api.post(`/logout`);
};

export const getCurrentUser = async () => {
  return api.get(`/user`);
}

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api