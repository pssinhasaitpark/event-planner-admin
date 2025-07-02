import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchRegistrationAndCertificates = createAsyncThunk(
  "registrationAndCertificates/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/registrationAndCertificates");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveRegistrationAndCertificates = createAsyncThunk(
  "registrationAndCertificates/save",
  async (formData) => {
    const response = await api.post("/registrationAndCertificates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateRegistrationAndCertificates = createAsyncThunk(
  "registrationAndCertificates/update",
  async ({ registrationId, data }) => {
    const response = await api.put(`/registrationAndCertificates/${registrationId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteRegistrationAndCertificates = createAsyncThunk(
  "registrationAndCertificates/delete",
  async (registrationId) => {
    await api.delete(`/registrationAndCertificates/${registrationId}`);
    return registrationId;
  }
);

const registrationAndCertificatesSlice = createSlice({
  name: "registrationAndCertificates",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationAndCertificates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRegistrationAndCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchRegistrationAndCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveRegistrationAndCertificates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveRegistrationAndCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveRegistrationAndCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateRegistrationAndCertificates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateRegistrationAndCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedRegistration = action.payload;
        state.data = state.data.map((registration) =>
          registration._id === updatedRegistration._id ? updatedRegistration : registration
        );
      })
      .addCase(updateRegistrationAndCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteRegistrationAndCertificates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRegistrationAndCertificates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((registration) => registration._id !== action.payload);
      })
      .addCase(deleteRegistrationAndCertificates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default registrationAndCertificatesSlice.reducer;
