import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { User } from "../../types/auth";


interface userState {
    users : User[]
}

const initialState : userState = {
    users : []
}

export const fetchUsers = createAsyncThunk('users/fetch', 
    async() => {
        const { data } = await axios.get('http://localhost:7000/admin/users-list')
        return data
    }
)

export const adminSlice = createSlice({
    name : 'admin',
    initialState,
    reducers : {},
    extraReducers : (bundler) => {
        bundler.addCase(fetchUsers.fulfilled, (state, action)=>{
            state.users = action.payload
        })
    }
})


export default adminSlice.reducer