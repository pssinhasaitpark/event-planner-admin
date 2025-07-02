import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchEvents = createAsyncThunk(
  "events/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/events/getAll");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveEvent = createAsyncThunk("events/save", async (formData) => {
  const response = await api.post("/events/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
});

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ eventId, data }) => {
    const response = await api.patch(`/events/${eventId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (eventId) => {
    await api.delete(`/events/${eventId}`);
    return eventId;
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedEvent = action.payload;
        state.data = state.data.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((event) => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;
