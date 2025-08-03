// lib/axios.js
import axios from "axios";

const base_url = "https://chat-app-1-6heo.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: base_url,
  withCredentials: true,
});
