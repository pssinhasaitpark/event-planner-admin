import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import api from "../redux/axios/axios";
const BASEURL = import.meta.env.VITE_REACT_APP_API_URL;

// Login request function
const login = async (userData) => {
  try {
    const response = await api.post(`${BASEURL}/auth/login`, userData);
    console.log("res:", response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Custom hook to handle login
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error) => {
      console.error("Login failed!", error);
    },
    onSuccess: (data) => {
      // console.log("Login success:", data);
    },
  });
};
