import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../axios/axios';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchQuotes = createAsyncThunk('getAQuote/fetchQuotes', async () => {
  const response = await api.get(`${BASE_URL}/quote`);
  return response.data.data;
});

// Async thunk for deleting a quote
export const deleteQuote = createAsyncThunk('getAQuote/deleteQuote', async (id) => {
  await api.delete(`${BASE_URL}/quote/${id}`);
  return id;
});

const getAQuoteSlice = createSlice({
  name: 'getAQuote',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.data = state.data.filter((quote) => quote._id !== action.payload);
      });
  },
});

export default getAQuoteSlice.reducer;
