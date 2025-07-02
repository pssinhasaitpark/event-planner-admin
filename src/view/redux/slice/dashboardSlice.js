import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchSubscribersCount = createAsyncThunk(
  "dashboard/fetchSubscribersCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscribers");
      return response.data.subscribers.length;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscribers"
      );
    }
  }
);

export const fetchInquiriesCount = createAsyncThunk(
  "dashboard/fetchInquiriesCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact");
      return response.data.contacts.length;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch inquiries"
      );
    }
  }
);

export const fetchMessagesCount = createAsyncThunk(
  "dashboard/fetchMessagesCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/message");
      return response.data.messages.length;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

export const fetchEventsCount = createAsyncThunk(
  "dashboard/fetchEventsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event");
      return response.data.events[0].imageGroups.length;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Initial state
const initialState = {
  totalSubscribers: 0,
  totalInquiries: 0,
  totalMessages: 0,
  totalEvents: 0,
  loading: false,
  error: null,
};

// Create the slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribersCount.fulfilled, (state, action) => {
        state.totalSubscribers = action.payload; // This is now a number
        state.loading = false;
      })
      .addCase(fetchInquiriesCount.fulfilled, (state, action) => {
        state.totalInquiries = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessagesCount.fulfilled, (state, action) => {
        state.totalMessages = action.payload;
        state.loading = false;
      })
      .addCase(fetchEventsCount.fulfilled, (state, action) => {
        state.totalEvents = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default dashboardSlice.reducer;
