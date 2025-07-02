import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Support Speak",
  description: "",
  images: [],
  status: "idle",
  error: null,
  supportSpeakers: [], // Initialize supportSpeakers array
};

// Fetch Support Speak Data from Backend
export const fetchSupportSpeakData = createAsyncThunk(
  "supportSpeak/fetchSupportSpeakData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/support-speaker");
      return response.data.supportSpeakers; // Return the supportSpeakers array
    } catch (error) {
      console.error("Error fetching support speak data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new Support Speaker
export const createSupportSpeaker = createAsyncThunk(
  "supportSpeak/createSupportSpeaker",
  async (supportSpeakData, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", supportSpeakData.name);
      formData.append("post", supportSpeakData.post);
      formData.append("location", supportSpeakData.location);

      supportSpeakData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const response = await api.post("/support-speaker", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchSupportSpeakData());
      return response.data; // Return the created speaker data
    } catch (error) {
      console.error("Error creating support speaker:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update an existing Support Speaker
export const updateSupportSpeaker = createAsyncThunk(
  "supportSpeak/updateSupportSpeaker",
  async ({ id, supportSpeakData }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("name", supportSpeakData.name);
      formData.append("post", supportSpeakData.post);
      formData.append("location", supportSpeakData.location);

      supportSpeakData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const response = await api.patch(
        `/support-speaker/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(fetchSupportSpeakData());
      return response.data; // Return the updated speaker data
    } catch (error) {
      console.error("Error updating support speaker:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a Support Speaker
export const deleteSupportSpeaker = createAsyncThunk(
  "supportSpeak/deleteSupportSpeaker",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // eslint-disable-next-line
      const response = await api.delete(`/support-speaker/delete/${id}`);
      dispatch(fetchSupportSpeakData());
      return id; // Return the id of the deleted speaker
    } catch (error) {
      console.error("Error deleting support speaker:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const supportSpeakSlice = createSlice({
  name: "supportSpeak",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportSpeakData.fulfilled, (state, action) => {
        state.supportSpeakers = action.payload; // Set the fetched speakers
      })
      .addCase(createSupportSpeaker.fulfilled, (state, action) => {
        state.supportSpeakers.push(action.payload); // Add the new speaker to the array
      })
      .addCase(updateSupportSpeaker.fulfilled, (state, action) => {
        const index = state.supportSpeakers.findIndex(
          (speaker) => speaker._id === action.payload._id
        );
        if (index !== -1) {
          state.supportSpeakers[index] = action.payload; // Update the existing speaker
        }
      })
      .addCase(deleteSupportSpeaker.fulfilled, (state, action) => {
        state.supportSpeakers = state.supportSpeakers.filter(
          (speaker) => speaker._id !== action.payload
        ); // Remove the deleted speaker
      });
  },
});

export default supportSpeakSlice.reducer;
