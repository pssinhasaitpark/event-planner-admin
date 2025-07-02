// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../axios/axios";

// export const fetchGallery = createAsyncThunk(
//   "gallery/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/gallery");
//       console.log("gall",response.data.data.data)
//       return response.data.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const saveGalleryImages = createAsyncThunk(
//   "gallery/saveImages",
//   async (formData) => {
//     const response = await api.post("/gallery/addImages", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   }
// );

// export const saveGalleryVideos = createAsyncThunk(
//   "gallery/saveVideos",
//   async (formData) => {
//     const response = await api.post("/gallery/addVideos", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   }
// );

// export const deleteGalleryItem = createAsyncThunk(
//   "gallery/delete",
//   async (galleryId) => {
//     await api.delete(`/gallery/${galleryId}`);
//     return galleryId;
//   }
// );

// const gallerySlice = createSlice({
//   name: "gallery",
//   initialState: {
//     data: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGallery.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchGallery.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = action.payload;
//       })
//       .addCase(fetchGallery.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(saveGalleryImages.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(saveGalleryImages.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data.push(action.payload);
//       })
//       .addCase(saveGalleryImages.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(saveGalleryVideos.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(saveGalleryVideos.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data.push(action.payload);
//       })
//       .addCase(saveGalleryVideos.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(deleteGalleryItem.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteGalleryItem.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.data = state.data.filter((item) => item._id !== action.payload);
//       })
//       .addCase(deleteGalleryItem.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default gallerySlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchGallery = createAsyncThunk(
  "gallery/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/gallery");
      console.log("gall", response.data.data.data);
      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveGalleryImages = createAsyncThunk(
  "gallery/saveImages",
  async (formData) => {
    const response = await api.post("/gallery/addImages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const saveGalleryVideos = createAsyncThunk(
  "gallery/saveVideos",
  async (formData) => {
    const response = await api.post("/gallery/addVideos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteGalleryItem = createAsyncThunk(
  "gallery/delete",
  async (galleryId) => {
    await api.delete(`/gallery/${galleryId}`);
    return galleryId;
  }
);

export const updateGalleryItem = createAsyncThunk(
  "gallery/update",
  async ({ galleryId, data }) => {
    const response = await api.put(`/gallery/${galleryId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveGalleryImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveGalleryImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveGalleryImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveGalleryVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveGalleryVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(saveGalleryVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteGalleryItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateGalleryItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedItem = action.payload;
        state.data = state.data.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default gallerySlice.reducer;
