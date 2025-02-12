import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchUserInfo, updateUserInfo } from "../../api/userApi";
import { AxiosError } from "axios";

interface UserState {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchUserInfo(userId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ userId, userData }: { userId: string; userData: { username?: string; email?: string } },
        { rejectWithValue }) => {
        try {
            const response = await updateUserInfo(userId, userData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            }
            return rejectWithValue("An unexpected error occurred.");
        }
    }
)

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        clearUserError : (state) => {
            state.error = null;
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})

export const { clearUserError } = userSlice.actions;

export const selectUser = (state: RootState) => state?.user?.user;
export const selectUserLoading = (state: RootState) => state?.user?.loading;
export const selectUserError = (state: RootState) => state?.user?.error;

export default userSlice.reducer;