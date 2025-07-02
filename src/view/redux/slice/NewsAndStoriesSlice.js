import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchNewsAndStories = createAsyncThunk(
  "newsAndStories/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/newsAndStories");
      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveNewsAndStory = createAsyncThunk(
  "newsAndStories/save",
  async (formData) => {
    const response = await api.post("/newsAndStories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateNewsAndStory = createAsyncThunk(
  "newsAndStories/update",
  async ({ newsId, data }) => {
    const response = await api.put(`/newsAndStories/${newsId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteNewsAndStory = createAsyncThunk(
  "newsAndStories/delete",
  async (newsId) => {
    await api.delete(`/newsAndStories/${newsId}`);
    return newsId;
  }
);

const newsAndStoriesSlice = createSlice({
  name: "newsAndStories",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsAndStories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNewsAndStories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchNewsAndStories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveNewsAndStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveNewsAndStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveNewsAndStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateNewsAndStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateNewsAndStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedNews = action.payload;
        state.data = state.data.map((news) =>
          news._id === updatedNews._id ? updatedNews : news
        );
      })
      .addCase(updateNewsAndStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteNewsAndStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteNewsAndStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((news) => news._id !== action.payload);
      })
      .addCase(deleteNewsAndStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default newsAndStoriesSlice.reducer;
