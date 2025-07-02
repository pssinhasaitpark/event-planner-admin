// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../axios/axios";

// export const fetchCategories = createAsyncThunk(
//   "category/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/category/categories");
//       return response?.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const saveCategory = createAsyncThunk(
//   "category/save",
//   async (formData) => {
//     const response = await api.post("/category/createCategories", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   }
// );

// export const updateCategory = createAsyncThunk(
//   "category/update",
//   async ({ categoryId, data }) => {
//     const response = await api.put(`/category/${categoryId}`, data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   }
// );

// export const deleteCategory = createAsyncThunk(
//   "category/delete",
//   async (categoryId) => {
//     await api.delete(`/category/${categoryId}`);
//     return categoryId;
//   }
// );

// const categorySlice = createSlice({
//   name: "category",
//   initialState: {
//     data: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = action.payload;
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(saveCategory.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(saveCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data.push(action.payload);
//       })
//       .addCase(saveCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(updateCategory.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const updatedCategory = action.payload;
//         state.data = state.data.map((category) =>
//           category._id === updatedCategory._id ? updatedCategory : category
//         );
//       })
//       .addCase(updateCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(deleteCategory.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = state.data.filter((category) => category._id !== action.payload);
//       })
//       .addCase(deleteCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default categoryySlice.reducer;

// categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get("/product/category");
    return response.data;
  }
);

export const saveCategory = createAsyncThunk(
  "categories/saveCategory",
  async (categoryData) => {
    const response = await axios.post("/product/category", categoryData);
    return response.data;
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
      });
  },
});

export default categorySlice.reducer;
