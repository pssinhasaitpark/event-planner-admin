import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Define the initial state
const initialState = {
  data: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Define the async thunks for API calls
export const fetchPolicyDetails = createAsyncThunk(
  "policy/fetchPolicyDetails",
  async (type) => {
    const response = await api.get(`/policy/${type}`);
    // console.log("response", response.data.data);
    // Ensure that the data is always an array
    return Array.isArray(response.data.data)
      ? response.data.data
      : [response.data.data];
  }
);

export const savePolicyDetails = createAsyncThunk(
  "policy/savePolicyDetails",
  async (data) => {
    const response = await api.post("/policy", data);
    return response.data;
  }
);

export const updatePolicyDetails = createAsyncThunk(
  "policy/updatePolicyDetails",
  async ({ policyId, data }) => {
    const response = await api.put(`/policy/${policyId}`, data);
    return response.data;
  }
);

export const deletePolicyDetails = createAsyncThunk(
  "policy/deletePolicyDetails",
  async (policyId) => {
    await api.delete(`/policy/${policyId}`);
    return policyId;
  }
);

// Create the slice
const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicyDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPolicyDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPolicyDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(savePolicyDetails.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updatePolicyDetails.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (policy) => policy._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deletePolicyDetails.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (policy) => policy._id !== action.payload
        );
      });
  },
});

export default policySlice.reducer;
