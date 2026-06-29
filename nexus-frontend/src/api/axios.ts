import axios from "axios";
import { toast } from "sonner";
import { SERVER_URL } from "@/config/env";

// Get the server URL from environment variables
const BASE_URL = SERVER_URL;

// This creates a centralized HTTP client that automatically handles
// authentication errors and provides consistent error handling across your app.

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "X-Nexus-Client": "web",
  },
});

// Set up the response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPage = window.location.pathname.startsWith("/auth");
    const requestUrl = originalRequest?.url ?? "";

    if (
      error.response?.status === 401 &&
      !isAuthPage &&
      originalRequest &&
      !originalRequest._retry &&
      requestUrl !== "/auth/refresh" &&
      requestUrl !== "/auth/logout"
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.get("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        try {
          await axiosInstance.post("/auth/logout");
        } catch (logoutError) {
          console.error("Error during auto-logout:", logoutError);
        }
        toast.error("Session expired. Please log in again.");
      }
    }

    if (!error.response) {
      error.errorType = "NETWORK_ERROR";
    } else {
      error.errorType = "SERVER_ERROR";
    }
    return Promise.reject(error);
  },
);

export async function getUser() {
  try {
    const { data } = await axiosInstance.get("/auth/user");
    return data.user;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("getUser error:", errorMessage);
    throw error;
  }
}

export default axiosInstance;
