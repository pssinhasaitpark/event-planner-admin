import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchAwards = createAsyncThunk(
  "awards/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/award");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveAward = createAsyncThunk(
  "awards/save",
  async (formData) => {
    const response = await api.post("/award", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateAward = createAsyncThunk(
  "awards/update",
  async ({ awardId, data }) => {
    const response = await api.put(`/award/${awardId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteAward = createAsyncThunk(
  "awards/delete",
  async (awardId) => {
    await api.delete(`/award/${awardId}`);
    return awardId;
  }
);

const awardsSlice = createSlice({
  name: "awards",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAwards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAwards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveAward.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAward.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveAward.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateAward.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAward.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedAward = action.payload;
        state.data = state.data.map((award) =>
          award._id === updatedAward._id ? updatedAward : award
        );
      })
      .addCase(updateAward.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteAward.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAward.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((award) => award._id !== action.payload);
      })
      .addCase(deleteAward.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default awardsSlice.reducer;
