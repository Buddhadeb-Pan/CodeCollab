import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      if (err.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection.");
      } else {
        toast.error("Network error. Cannot reach server.");
      }
      return Promise.reject(err);
    }

    if (err.response.status === 401) {
      const wasLoggedIn = localStorage.getItem("cc_token");
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");
      if (wasLoggedIn && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (err.response.status === 429) {
      toast.error(err.response.data?.message || "Too many requests. Slow down.");
    }

    if (err.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(err);
  }
);

export default api;
