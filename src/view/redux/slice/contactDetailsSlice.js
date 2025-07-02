// src/redux/slice/contactDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../axios/axios';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchContactDetails = createAsyncThunk('contactDetails/fetchContactDetails', async () => {
  const response = await api.get(`${BASE_URL}/contact`);
  console.log("response.data", response.data.data);
  
  return response.data.data;
});

export const addContactDetail = createAsyncThunk('contactDetails/addContactDetail', async (contactData) => {
  const response = await api.post(`${BASE_URL}/contact`, contactData);
  return response.data;
});

export const updateContactDetail = createAsyncThunk('contactDetails/updateContactDetail', async ({ id, contactData }) => {
  const response = await api.put(`${BASE_URL}/contact/${id}`, contactData);
  return response.data;
});

export const deleteContactDetail = createAsyncThunk('contactDetails/deleteContactDetail', async (id) => {
  await api.delete(`${BASE_URL}/contact/${id}`);
  return id;
});

const contactDetailsSlice = createSlice({
  name: 'contactDetails',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addContactDetail.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateContactDetail.fulfilled, (state, action) => {
        const index = state.data.findIndex((contact) => contact._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteContactDetail.fulfilled, (state, action) => {
        state.data = state.data.filter((contact) => contact._id !== action.payload);
      });
  },
});

export default contactDetailsSlice.reducer;
