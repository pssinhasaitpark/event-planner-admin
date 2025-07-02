import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Initial state
const initialState = {
  eventVideos: [],
  status: "idle",
  error: null,
};

// Fetch all event videos
export const fetchEventVideoData = createAsyncThunk(
  "eventVideos/fetchEventVideoData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event-videos");
      return response.data.eventVideos || [];
    } catch (error) {
      console.error("Error fetching event videos:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new event video
export const createEventVideo = createAsyncThunk(
  "eventVideos/createEventVideo",
  async (eventData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/event-videos/add", eventData);
      await dispatch(fetchEventVideoData());
      return response.data;
    } catch (error) {
      console.error("Error creating event video:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update an event video

export const updateEventVideo = createAsyncThunk(
  "eventVideos/updateEventVideo",
  async ({ eventId, eventData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(
        `/event-videos/update/${eventId}`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Ensure correct content type
          },
        }
      );
      await dispatch(fetchEventVideoData());
      return response.data;
    } catch (error) {
      console.error("Error updating event video:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete an event video
export const deleteEventVideo = createAsyncThunk(
  "eventVideos/deleteEventVideo",
  async (eventId, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/event-videos/${eventId}`);
      await dispatch(fetchEventVideoData());
      return eventId;
    } catch (error) {
      console.error("Error deleting event video:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventVideosSlice = createSlice({
  name: "eventVideos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all event videos
      .addCase(fetchEventVideoData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventVideoData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.eventVideos = action.payload;
      })
      .addCase(fetchEventVideoData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create a new event video
      .addCase(createEventVideo.fulfilled, (state, action) => {
        state.eventVideos.push(action.payload);
      })

      // Update an event video
      .addCase(updateEventVideo.fulfilled, (state, action) => {
        const updatedEventVideo = action.payload;
        const index = state.eventVideos.findIndex(
          (eventVideo) => eventVideo._id === updatedEventVideo._id
        );
        if (index !== -1) {
          state.eventVideos[index] = updatedEventVideo;
        }
      })

      // Delete an event video
      .addCase(deleteEventVideo.fulfilled, (state, action) => {
        state.eventVideos = state.eventVideos.filter(
          (eventVideo) => eventVideo._id !== action.payload
        );
      });
  },
});

export default eventVideosSlice.reducer;
