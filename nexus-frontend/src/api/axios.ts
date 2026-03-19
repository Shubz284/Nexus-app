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
});

// Set up the response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // The condition is now more specific
    if (
      error.response &&
      error.response.status === 401 &&
      // ✅ ADD THIS CHECK: Only run this logic if we are NOT on an auth page
      !window.location.pathname.startsWith("/auth")
    ) {
      console.error(
        "Session expired! Caught by interceptor, redirecting to login.",
      );
      try {
        // Attempt to log the user out to clear the session
        await axiosInstance.post("/auth/logout");
      } catch (logoutError) {
        console.error("Error during auto-logout:", logoutError);
      } finally {
        // Only redirect if it's a true session expiration
        toast.error(
          "Session expired! Caught by interceptor, redirecting to login.",
        );
        const timer = setTimeout(() => {
          window.location.href = "/auth/login";
        }, 3000);
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
