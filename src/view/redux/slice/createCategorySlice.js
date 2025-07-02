import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await api.get("/product/all-categories");
    // console.log("Fetched categories:", response.data); // Log the response data
    return response.data.data; // Ensure this returns the correct data structure
  }
);

// Async thunk for saving a category
export const saveCategory = createAsyncThunk(
  "categories/saveCategory",
  async (categoryData) => {
    const response = await api.post("/product/category", categoryData);
    return response.data.data; // Ensure this returns the correct data structure
  }
);

// Async thunk for updating a category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }) => {
    const response = await api.put(`/product/category/${id}`, categoryData);
    return response.data.data; // Ensure this returns the correct data structure
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    await api.delete(`/product/category/${id}`);
    return id;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (category) => category._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
