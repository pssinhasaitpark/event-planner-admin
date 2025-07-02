import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all programmes
export const fetchProgrammes = createAsyncThunk(
  "programmes/fetchProgrammes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/our-programme");
      return response.data.ourProgrammes || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching programmes"
      );
    }
  }
);

// Async thunk for fetching programmes by category
export const fetchProgrammesByCategory = createAsyncThunk(
  "programmes/fetchProgrammesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.get(`/our-programme/category/${category}`);
      return response.data.ourProgrammes || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching programmes by category"
      );
    }
  }
);

// Async thunk for adding a programme
export const addProgramme = createAsyncThunk(
  "programmes/addProgramme",
  async (programmeData, { rejectWithValue, dispatch }) => {
    try {
      await api.post("/our-programme", programmeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchProgrammes());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding programme");
    }
  }
);

// Async thunk for updating a programme
export const updateProgramme = createAsyncThunk(
  "programmes/updateProgramme",
  async ({ category, formData }, { rejectWithValue, dispatch }) => {
    try {
      await api.patch(`/our-programme/update/${category}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchProgrammes());
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating programme"
      );
    }
  }
);

export const updateSection = createAsyncThunk(
  "programmes/updateSection",
  async ({ category, id, formData }, { rejectWithValue, dispatch }) => {
    try {
      await api.patch(
        `/our-programme/update/${category}/details/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await dispatch(fetchProgrammes());
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating programme"
      );
    }
  }
);

// Async thunk for deleting a programme detail
export const deleteProgrammeDetail = createAsyncThunk(
  "programmes/deleteProgrammeDetail",
  async ({ category, detailId }, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/our-programme/delete/${category}/details/${detailId}`);
      await dispatch(fetchProgrammes());
      return detailId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error deleting programme detail"
      );
    }
  }
);

const programmesSlice = createSlice({
  name: "programmes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgrammes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgrammes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProgrammes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProgrammesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgrammesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProgrammesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProgramme.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgramme.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProgramme.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProgramme.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSection.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProgrammeDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProgrammeDetail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProgrammeDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = programmesSlice.actions;
export default programmesSlice.reducer;
