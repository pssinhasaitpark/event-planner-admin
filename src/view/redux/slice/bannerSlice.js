import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// Fetch Banners
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banner/getAll");
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveBannerToBackend = createAsyncThunk(
  "banner/saveBannerToBackend",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/banner/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ bannerId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/banner/${bannerId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return { bannerId, updatedBanner: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a Banner
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      await api.delete(`/banner/${bannerId}`);
      return bannerId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Save or Update Banner
      .addCase(saveBannerToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveBannerToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state.data, action.payload];
      })
      .addCase(saveBannerToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { bannerId, updatedBanner } = action.payload;
        state.data = state.data.map((banner) =>
          banner._id === bannerId ? updatedBanner : banner
        );
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((banner) => banner._id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
