import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
});

// attach token when present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signupSendOTP = (payload) => API.post("/auth/signup", payload);
export const verifyOTP = (payload) => API.post("/auth/verify-otp", payload);
export const loginReq = (payload) => API.post("/auth/login", payload);

// Optional if you later add /auth/me on backend:
// export const fetchProfile = () => API.get("/auth/me");
