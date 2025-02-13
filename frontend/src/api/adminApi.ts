import axios from "axios";

const API_BASE_URL = 'http://localhost:7000/admin'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})

export const getAllUsers = () => {
    return api.get('/users')
}

export const createUser = async (userdata : {username: string, email: string, password: string, role : string}) => {
    return api.post('/create-user',userdata)
}

export const updateUser = async (userId : string, userData : {username?: string, email?: string, role ?: string}) => {
    return api.put(`/update/${userId}`,userData)
}

export const deleteUser = async (userId : string) => {
    return api.delete(`/delete/${userId}`)
}