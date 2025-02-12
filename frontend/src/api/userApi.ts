import axios from "axios";


const API_URL = 'http://localhost:7000/user';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const fetchUserInfo = async (userId : string) => {
    return api.get(`/user/${userId}`);
}

export const updateUserInfo = async (userId : string, userData : {username? : string, email? : string}) => {
    return api.put(`/user/${userId}`, userData);
}