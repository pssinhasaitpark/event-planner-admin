import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchSocialMedia = createAsyncThunk("socialMedia/fetch", async () => {
  const response = await api.get("/socialmedia");
  return response.data.data;
});

export const updateSocialMedia = createAsyncThunk("socialMedia/update", async ({ id, updatedLinks }) => {
  const response = await api.put(`/socialmedia/${id}`, updatedLinks);
  return response.data;
});

export const addSocialMedia = createAsyncThunk("socialMedia/add", async (newLinks) => {
  const response = await api.post("/socialmedia", newLinks);
  return response.data;
});

export const deleteSocialMediaLink = createAsyncThunk("socialMedia/delete", async ({ id, key }) => {
  const response = await api.delete(`/socialmedia/${id}`);
  return response.data;
});

const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    links: {},
    id: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload || {};
        state.id = action.payload?._id || null;
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.links = action.payload;
      })
      .addCase(addSocialMedia.fulfilled, (state, action) => {
        state.links = action.payload;
        state.id = action.payload._id;
      })
      .addCase(deleteSocialMediaLink.fulfilled, (state, action) => {
        const { key } = action.meta.arg;
        delete state.links[key];
      });
  },
});

export default socialMediaSlice.reducer;
