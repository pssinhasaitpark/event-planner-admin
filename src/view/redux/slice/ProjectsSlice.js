import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/project/all");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveProject = createAsyncThunk(
  "projects/save",
  async (formData) => {
    const response = await api.post("/project/createProject", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ projectId, data }) => {
    const response = await api.put(`/project/${projectId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId) => {
    await api.delete(`/project/${projectId}`);
    return projectId;
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/category/categories");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "subcategories/fetch",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subCategory/by-category/${categoryId}`);
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    data: [],
    categories: [],
    subcategories: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProject = action.payload;
        state.data = state.data.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((project) => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSubcategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;
