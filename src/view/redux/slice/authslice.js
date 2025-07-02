import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    userRole: localStorage.getItem("role") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log("action.payload", action.payload);
    
      console.log("action.payload.token", action.payload);
      // Fix: Use the correct property names from the payload
      state.token = action.payload.token;
      state.userRole = action.payload.role;
      state.user = action.payload; // Store the entire user object
    },
    logoutUser: (state) => {
      state.token = null;
      state.userRole = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
