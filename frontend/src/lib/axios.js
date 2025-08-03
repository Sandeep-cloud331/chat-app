// lib/axios.js
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: base_url,
  withCredentials: true,
});
