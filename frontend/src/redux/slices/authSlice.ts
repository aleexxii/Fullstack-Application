import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginData, AuthState, LoginResponse, User } from "../../types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

interface RegisterData {
  name : string;
  email : string;
  password : string
}

export const register = createAsyncThunk<User,RegisterData,{rejectValue : string}>('auth/register',
  async(userData, {rejectWithValue}) => {
    try{
      const response = await fetch('http://localhost:7000/auth/register', {
        method : 'POST',
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(userData)
      })
      if(!response.ok){
        const errorData = await response.json()
        return rejectWithValue(errorData.message)
      }
      const user = await response.json()
      return user
    }catch(error){
      if(error instanceof Error) rejectWithValue(error.message)
    }
  }
)

export const login = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message);
    }

    const userResponse = await fetch("http://localhost:7000/auth/me", {
      credentials: "include",
    });

    if (!userResponse.ok) return rejectWithValue("Failed to fetch user data.");
    const userData = await userResponse.json();

    const token = document.cookie.split("=")[1];
    return { user: userData.user, token };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = (action.payload as string) ?? "An unknown error occurred";
    })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = (action.payload as string) ?? "An unknown error occurred";
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
