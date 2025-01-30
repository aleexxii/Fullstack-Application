import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/auth";

interface userState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: userState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "http://localhost:7000/admin/users-list"
      );
      return data;
    } catch (error) {
      if (error instanceof Error)
        rejectWithValue(error.message || "failed to fetch");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:7000/admin/create-user",
        userData
      );
      console.log("created user response : ", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error)
        rejectWithValue(error.message || "failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (
    userData: { id: string; name: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:7000/admin/update/${userData.id}`,
        userData
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error)
        rejectWithValue(error.message || "failed to update");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:7000/admin/delete/${id}`);
      return id;
    } catch (error) {
      if (error instanceof Error) rejectWithValue(error.message);
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (bundler) => {
    bundler
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload?.updatedUser) {
          const updatedUser = action.payload.updatedUser;
          state.users = state.users.map((user) => {
            const plainUser = JSON.parse(JSON.stringify(user));
            return plainUser._id === updatedUser._id ? updatedUser : plainUser;
          });
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
