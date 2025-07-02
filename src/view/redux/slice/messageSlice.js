import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/message");
      // console.log("Fetched message data", response.data);
      return response.data.messages;
    } catch (error) {
      console.log("Error fetching messages data", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteMessageData = createAsyncThunk(
  "message/deleteMessageData",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/message/${id}`); // No need to return response
      return id; // Return only the deleted testimonial ID
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
