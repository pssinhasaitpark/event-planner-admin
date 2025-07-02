

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios/axios';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
const token = localStorage.getItem("token");

export const fetchVanvasiPosts = createAsyncThunk('vanvasi/fetchPosts', async () => {
  const response = await api.get(`${BASE_URL}/section/all`);
  return response.data.data;
});

export const addVanvasiPost = createAsyncThunk('vanvasi/addPost', async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('description', postData.description);
  formData.append('category', postData.category);

  postData.images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post(`${BASE_URL}/section/create`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
});

export const updateVanvasiPost = createAsyncThunk('vanvasi/updatePost', async ({ id, postData }) => {
  const response = await api.put(`${BASE_URL}/section/update/${id}`, postData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
});


export const deleteVanvasiPost = createAsyncThunk('vanvasi/deletePost', async (id) => {
  await api.delete(`${BASE_URL}/section/delete/${id}`);
  return id;
});

const vanvasiSectionSlice = createSlice({
  name: 'vanvasi',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVanvasiPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVanvasiPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.map(post => ({
          ...post,
          images: post.images || [] // Ensure images is an array
        }));
      })
      .addCase(fetchVanvasiPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addVanvasiPost.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateVanvasiPost.fulfilled, (state, action) => {
        const index = state.data.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteVanvasiPost.fulfilled, (state, action) => {
        state.data = state.data.filter((post) => post._id !== action.payload);
      });
  },
});

export default vanvasiSectionSlice.reducer;
