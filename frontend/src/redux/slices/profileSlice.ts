import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import { RootState } from "../store";

interface ProfileState {
  profileData: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profileData: null,
  loading: false,
  error: null,
};

export const fetchProfileData = createAsyncThunk(
  "profile/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:7000/user/profile", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (
    updateData: { name?: string; email?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;

      const response = await fetch(
        "http://localhost:7000/user/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log('updated user >> ', data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
