import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchSubCategory = createAsyncThunk(
  "subCategory/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subCategory");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveSubCategory = createAsyncThunk(
  "subCategory/save",
  async (data) => {
    const response = await api.post("/subCategory/create", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);

export const updateSubCategory = createAsyncThunk(
  "subCategory/update",
  async ({ subCategoryId, data }) => {
    const response = await api.put(`/subCategory/${subCategoryId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subCategory/delete",
  async (subCategoryId) => {
    await api.delete(`/subCategory/${subCategoryId}`);
    return subCategoryId;
  }
);

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedSubCategory = action.payload;
        state.data = state.data.map((subCategory) =>
          subCategory._id === updatedSubCategory._id ? updatedSubCategory : subCategory
        );
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((subCategory) => subCategory._id !== action.payload);
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default subCategorySlice.reducer;
