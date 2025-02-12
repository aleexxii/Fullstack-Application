import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register, logout, getCurrentUser } from "../../api/authApi";
import { AxiosError } from "axios";

interface AuthState {
  user: null | {id:string, username: string; email: string; roles: string };
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
    }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await register(username, email, password);
      console.log("response data :", response);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return rejectWithValue(error.response.data.message);
        }
        if (error.request) {
          return rejectWithValue("No response from server. Please try again.");
        }
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: { email: string; password: string }) => {
    try {
      const response = await login(userData.email, userData.password);
      console.log('response :', response);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return error.response.data.message;
        }
        if (error.request) {
          return "No response from server. Please try again.";
        }
      }
      return "An unexpected error occurred. Please try again.";
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logout();
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    const response = await getCurrentUser();
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to register.";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log("success login", action.payload);
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
