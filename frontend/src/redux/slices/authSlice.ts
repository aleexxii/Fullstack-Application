import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials, LoginResponse, User } from "../../types/auth";


const initialState : AuthState = {
    user : null,
    isLoading : false,
    error : null
}

export const login = createAsyncThunk<User, LoginCredentials>(
    'auth/login',
    async (credentials, {rejectWithValue}) => {
        try{
            console.log('cred >>', credentials);
            const response = await fetch("http://localhost:7000/auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials : 'include',
                body: JSON.stringify(credentials),
              });

              if(!response.ok){
                const error = await response.json()
                return rejectWithValue(error.message)
              }

              const data : LoginResponse = await response.json()
              return data.user

        }catch(error){
            console.log(error);
            return rejectWithValue('Login failed')
        }
    }
)

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        clearError : (state) => {
            state.error = null
        }
    },
    extraReducers : (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null
        });
        builder.addCase(login.fulfilled, (state,action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null
        });
        builder.addCase(login.rejected, (state, action) => {
            state.error = action.payload as string
        })
    }
})
 
export const { clearError }= authSlice.actions
export default authSlice.reducer