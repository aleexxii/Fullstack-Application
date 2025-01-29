import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginData, AuthState, LoginResponse } from '../../types/auth'

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  LoginResponse, // Return type
  LoginData,    // Argument type
  {
    rejectValue: string;  // Error type
  }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:7000/auth/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message);
      }

      const data = await response.json();
      return data as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(`Internal server Error: ${error.message}`);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload ?? 'An unknown error occurred';
      });
  }
});

export const { logout } = authSlice.actions
export default authSlice.reducer