import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";
import { Cog } from "lucide-react";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await api.get("/product/products");
    return response.data.data 
  }
);

export const saveProduct = createAsyncThunk(
  "products/saveProduct",
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
  "products/updateProduct",
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
  "products/deleteProduct",
  async (productId) => {
    await api.delete(`/product/${productId}`);
    return productId;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
