import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchCommitteeOrTrustee = createAsyncThunk(
  "committeeOrTrustee/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/committeeOrTrustee/allCommitteeOrTrustee");
      return response?.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveCommitteeOrTrustee = createAsyncThunk(
  "committeeOrTrustee/save",
  async (formData) => {
    const response = await api.post("/committeeOrTrustee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const updateCommitteeOrTrustee = createAsyncThunk(
  "committeeOrTrustee/update",
  async ({ committeeId, data }) => {
    const response = await api.put(`/committeeOrTrustee/${committeeId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteCommitteeOrTrustee = createAsyncThunk(
  "committeeOrTrustee/delete",
  async (committeeId) => {
    await api.delete(`/committeeOrTrustee/${committeeId}`);
    return committeeId;
  }
);

const committeeOrTrusteeSlice = createSlice({
  name: "committeeOrTrustee",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommitteeOrTrustee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommitteeOrTrustee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCommitteeOrTrustee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveCommitteeOrTrustee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveCommitteeOrTrustee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveCommitteeOrTrustee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCommitteeOrTrustee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCommitteeOrTrustee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCommittee = action.payload;
        state.data = state.data.map((committee) =>
          committee._id === updatedCommittee._id ? updatedCommittee : committee
        );
      })
      .addCase(updateCommitteeOrTrustee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCommitteeOrTrustee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCommitteeOrTrustee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((committee) => committee._id !== action.payload);
      })
      .addCase(deleteCommitteeOrTrustee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default committeeOrTrusteeSlice.reducer;
