// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Check email
export const checkEmail = (email) =>
  API.post("/check-email", { email });

// Register / Signup
export const signup = (data) =>
  API.post("/signup", data);

// Login
export const login = (data) =>
  API.post("/login", data);

// Send OTP (Forgot Password)
export const sendOTP = (email) =>
  API.post("/send-otp", { email });

// Verify OTP
export const verifyOTP = (email, otp) =>
  API.post("/verify-otp", { email, otp });

// Reset Password (after OTP verified)
export const resetPassword = (email, newPassword) =>
  API.post("/reset-password", { email, newPassword });

export default API;
