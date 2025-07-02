import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchGetInvolved = createAsyncThunk(
  "getInvolved/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getInvolved");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveGetInvolved = createAsyncThunk(
  "getInvolved/save",
  async (formData) => {
    const response = await api.post("/getInvolved", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateGetInvolved = createAsyncThunk(
  "getInvolved/update",
  async ({ getInvolvedId, data }) => {
    const response = await api.put(`/getInvolved/${getInvolvedId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteGetInvolved = createAsyncThunk(
  "getInvolved/delete",
  async (getInvolvedId) => {
    await api.delete(`/getInvolved/${getInvolvedId}`);
    return getInvolvedId;
  }
);

const getInvolvedSlice = createSlice({
  name: "getInvolved",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetInvolved.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGetInvolved.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchGetInvolved.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveGetInvolved.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveGetInvolved.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveGetInvolved.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateGetInvolved.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateGetInvolved.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedGetInvolved = action.payload;
        state.data = state.data.map((getInvolved) =>
          getInvolved._id === updatedGetInvolved._id ? updatedGetInvolved : getInvolved
        );
      })
      .addCase(updateGetInvolved.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteGetInvolved.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteGetInvolved.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((getInvolved) => getInvolved._id !== action.payload);
      })
      .addCase(deleteGetInvolved.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default getInvolvedSlice.reducer;
