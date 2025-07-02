import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await api.get("/news");
  return response.data.allNews;
});

export const createNews = createAsyncThunk(
  "news/createNews",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/news/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create News."
      );
    }
  }
);

export const updateNews = createAsyncThunk(
  "news/updateNews",
  async ({ newsId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/news/update/${newsId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update News."
      );
    }
  }
);

export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/news/${newsId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete News."
      );
    }
  }
);
const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch News
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create News
      .addCase(createNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.push(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update News
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.map((newsItem) =>
          newsItem._id === action.payload._id ? action.payload : newsItem
        );
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;
