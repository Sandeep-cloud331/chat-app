import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const base_url = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/";

export const useAuthStore = create((set, get) => ({
  onlineUsers: [],
  // setOnlineUsers: (users) => set({ onlineUsers: users }),
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    }
    finally {
      console.log("error in final");
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);

    }
    finally {
      set({ isSigningUp: false });

    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("auth/login", data);
      set({ authUser: response.data });
      toast.success("logged in succesfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logged out successfully")
      get().disconnectSocket();
    } catch (error) {
      toast.error("error in logout ")
    }
  },

  updateProfile: async (data) => {
    set({ isUpdateProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("profile updated successfully")
    } catch (error) {
      console.log("error", error);

      toast.error("error in update profile auth")
    }
    finally {
      set({ isUpdateProfile: false })
    }
  },
  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) return;
    const socket = io(base_url, {
      query: {
        userId: authUser._id,
      },
    })
    socket.connect()
    set({ socket: socket });
    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds })
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();

  }
}))