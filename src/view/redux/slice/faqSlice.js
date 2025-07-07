import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Async thunk for fetching FAQs
export const fetchFaqs = createAsyncThunk(
  "faqs/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/faq");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for saving a FAQ
export const saveFaq = createAsyncThunk("faqs/save", async (faqData) => {
  const response = await api.post("/faq", faqData);
  return response.data;
});

// Async thunk for updating a FAQ
export const updateFaq = createAsyncThunk(
  "faqs/update",
  async ({ faqId, data }) => {
    const response = await api.patch(`/faq/${faqId}`, data);
    return response.data;
  }
);

// Async thunk for deleting a FAQ
export const deleteFaq = createAsyncThunk("faqs/delete", async (faqId) => {
  await api.delete(`/faq/${faqId}`);
  return faqId;
});

const faqSlice = createSlice({
  name: "faqs",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveFaq.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFaq.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveFaq.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFaq.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedFaq = action.payload;
        state.data = state.data.map((faq) =>
          faq._id === updatedFaq._id ? updatedFaq : faq
        );
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteFaq.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((faq) => faq._id !== action.payload);
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default faqSlice.reducer;
