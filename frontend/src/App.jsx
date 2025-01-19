import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import SettingsPage from "./pages/settingsPage";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/profilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        <Route path="/signup" element={!authUser ? <SignUpPage /> : <HomePage />} />

        <Route path="/login" element={!authUser ? <LoginPage /> : <HomePage />} />

        <Route path="/settings" element={<SettingsPage />}></Route>

        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}></Route>

      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
