// artistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Async thunk for fetching artists
export const fetchArtists = createAsyncThunk(
  "artists/fetchArtists",
  async () => {
    const response = await api.get("/artist");
    return response.data.data; // Access the data array from the response
  }
);

// Async thunk for saving an artist
export const saveArtistToBackend = createAsyncThunk(
  "artists/saveArtistToBackend",
  async (artistData) => {
    const response = await api.post("/artist", artistData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; // Return the saved artist data
  }
);

// Async thunk for updating an artist
export const updateArtist = createAsyncThunk(
  "artists/updateArtist",
  async ({ artistId, data }) => {
    const response = await api.put(`/artist/${artistId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; // Return the updated artist data
  }
);

// Async thunk for deleting an artist
export const deleteArtist = createAsyncThunk(
  "artists/deleteArtist",
  async (artistId) => {
    await api.delete(`/artist/${artistId}`);
    return artistId;
  }
);

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    data: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Set the fetched artists data
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveArtistToBackend.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the new artist to the state
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (artist) => artist._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload; // Update the artist in the state
        }
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (artist) => artist._id !== action.payload // Remove the deleted artist from the state
        );
      });
  },
});

export default artistSlice.reducer;
