import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

export const fetchContactData = createAsyncThunk(
  "contact/fetchContactData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact");
      return response.data.contacts;
    } catch (error) {
      console.log("Error fetching contact data", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteContactData = createAsyncThunk(
  "contact/deleteContactData",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteContactData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        ); // Remove the deleted testimonial
      })
      .addCase(deleteContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
