// bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchBookings = createAsyncThunk(
  "bookings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/booking/getAll");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveBooking = createAsyncThunk(
  "bookings/save",
  async (bookingData) => {
    const response = await api.post("/booking/create", bookingData);
    return response.data;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/update",
  async ({ bookingId, data }) => {
    const response = await api.put(`/booking/${bookingId}`, data);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (bookingId) => {
    await api.delete(`/booking/${bookingId}`);
    return bookingId;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedBooking = action.payload;
        state.data = state.data.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((booking) => booking._id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;
