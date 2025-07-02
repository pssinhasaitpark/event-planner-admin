import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchPageDetails = createAsyncThunk(
  "pageDetails/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pagesDetails/all");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",response.data.data.pages)
      return response.data.data.pages;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const savePageDetails = createAsyncThunk(
  "pageDetails/save",
  async (formData) => {
    const response = await api.post("/pagesDetails/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updatePageDetails = createAsyncThunk(
  "pageDetails/update",
  async ({ pageId, data }) => {
    const response = await api.put(`/pagesDetails/update/${pageId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deletePageDetails = createAsyncThunk(
  "pageDetails/delete",
  async (pageId) => {
    await api.delete(`/pagesDetails/delete/${pageId}`);
    return pageId;
  }
);

const pageDetailsSlice = createSlice({
  name: "pageDetails",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPageDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPageDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(savePageDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(savePageDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(savePageDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePageDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePageDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPage = action.payload;
        state.data = state.data.map((page) =>
          page._id === updatedPage._id ? updatedPage : page
        );
      })
      .addCase(updatePageDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePageDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePageDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((page) => page._id !== action.payload);
      })
      .addCase(deletePageDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default pageDetailsSlice.reducer;
