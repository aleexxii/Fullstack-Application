import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginData, AuthState, LoginResponse, User } from "../../types/auth";
import { store } from "../store";


const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
}


export const register = createAsyncThunk<
  User,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) rejectWithValue(error.message);
  }
});





export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    const token = store.getState().auth.token
    console.log('tok > ', token);
    try {
      const response = await fetch("http://localhost:7000/auth/me", {
        headers: {
          Authorization : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await dispatch(refreshToken()).unwrap();
        
        if (refreshResponse) {
          const retryResponse = await fetch("http://localhost:7000/auth/me", {
            headers: { Authorization: `Bearer ${refreshResponse.token}` },
            credentials: "include",
          });
          const data = await retryResponse.json();
          return data.user;
        }
      }

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);








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

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message);
    }

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});






export const refreshToken = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, {dispatch, rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7000/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    console.log('refresh token response : ', response);

    if (!response.ok) {
      dispatch(logout())
      return rejectWithValue("Session expired, please log in again.");
    }
    const data: LoginResponse = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue(
      `An error occurred while refreshing token. ${error}`
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
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
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
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
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
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout, setToken, updateUser } = authSlice.actions;
export default authSlice.reducer;
