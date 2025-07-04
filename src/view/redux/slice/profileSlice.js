import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  user_role: "",
  full_name: "",
  email: "",
  loading: false,
  mobile: "",
  error: null,
};

export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      console.log("al;fkgjadlkfjasdfasf",response.data)
      
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching profile data", error);
      return rejectWithValue(error.response?.data || error.message);
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
        state.user_role = action.payload.role;
        state.full_name = action.payload.name;
        state.email = action.payload.email;
        state.mobile = action.payload.mobile;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
