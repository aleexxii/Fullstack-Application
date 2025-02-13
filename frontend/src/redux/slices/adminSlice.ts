import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/adminApi";
import { AxiosError } from "axios";

interface AdminState {
  users: User[];
  error: string | null;
  loading: boolean;
}

const initialState: AdminState = {
  users: [],
  error: null,
  loading: false,
};

export const fetchAllUsers = createAsyncThunk("admin/fetchAll", async () => {
  const response = await getAllUsers();
  return response.data;
});

export const create_user = createAsyncThunk(
  "admin/createUser",
  async (userdata: {
    username: string;
    email: string;
    password: string;
    role: string;
  },{rejectWithValue}) => {
    try{
        const response = await createUser(userdata);
    return response.data;
    }catch(error){
        if(error instanceof AxiosError) return rejectWithValue(error.response?.data.message)
        return rejectWithValue('No response from server. Please try again.')
    }
  }
);

export const delete_user = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string) => {
    const response = await deleteUser(userId);
    console.log("delete response :>>", response);
    return userId;
  }
);

export const update_user = createAsyncThunk(
  "admin/updateUser",
  async ({
    userId,
    userData,
  }: {
    userId: string;
    userData: { username?: string; email?: string; role?: string };
  }) => {
    const response = await updateUser(userId, userData);
    console.log("response from update >>", response);
    return response.data;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(create_user.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(create_user.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(create_user.rejected, (state, action) => {
        state.loading = false;
        console.log('action.error.message >> ', action.error);
        state.error = action.error.message as string;
      })
      .addCase(update_user.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_user.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(update_user.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(delete_user.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_user.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(delete_user.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
