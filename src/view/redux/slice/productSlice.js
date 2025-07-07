import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/products");
      console.log("Fetched products:", response.data.data.products);
      return response.data.data.products;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/all-categories");
      console.log("Fetched categories:", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveProduct = createAsyncThunk(
  "products/save",
  async (formData) => {
    const response = await api.post("/product/add-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ productId, data }) => {
    const response = await api.put(`/product/${productId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId) => {
    await api.delete(`/product/${productId}`);
    return productId;
  }
);

export const saveCategory = createAsyncThunk(
  "products/saveCategory",
  async (categoryData, { rejectWithValue, dispatch }) => {
    const response = await api.post("/product/category", categoryData);
    dispatch(fetchCategories()); // Refresh categories after saving
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    categories: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload;
        state.data = state.data.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
