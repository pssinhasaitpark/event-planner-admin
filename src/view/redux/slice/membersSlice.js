import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Members",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Members Data from Backend
export const fetchMembersData = createAsyncThunk(
  "members/fetchMembersData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/members");
      return response.data.members[0] || {};
    } catch (error) {
      console.error("Error fetching members data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Members Data to Backend
export const saveMembersToBackend = createAsyncThunk(
  "members/saveMembersToBackend",
  async ({ id, membersData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", membersData.title);
      formData.append(
        "description",
        membersData.description?.trim() || "No description provided"
      );

      membersData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (membersData.removeImages?.length > 0) {
        formData.append("removeImages", JSON.stringify(membersData.removeImages));
      }

      const endpoint = id ? `/members/create?id=${id}` : "/members/create";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving members data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMembersData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default membersSlice.reducer;
