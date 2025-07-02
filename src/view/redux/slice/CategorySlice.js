import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/category/categories");
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveCategoryToBackend = createAsyncThunk(
  "category/saveCategoryToBackend",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/category/createCategories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => { // Change 'categoryId' to 'id'
    try {
      console.log("Updating category with ID:", id); // Add this line
      const response = await api.put(`/category/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { categoryId: id, updatedCategory: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/category/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveCategoryToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveCategoryToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state.data, action.payload];
      })
      .addCase(saveCategoryToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { categoryId, updatedCategory } = action.payload;
        state.data = state.data.map((category) =>
          category._id === categoryId ? updatedCategory : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
