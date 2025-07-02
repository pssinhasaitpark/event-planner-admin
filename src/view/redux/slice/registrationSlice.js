import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

// Async Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "registration/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users"); // Ensure this is the correct endpoint
      // console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.users)) {
        return response.data.users; // Return the array of users correctly
      } else {
        return rejectWithValue("No users found");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload; // Store the entire users array
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default registrationSlice.reducer;
