import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { showErrorToast } from "@/lib/toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const handleBackendError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return;
  }

  const isNetworkError = !error.response;
  const isServerError =
    error.response?.status !== undefined && error.response.status >= 500;

  if (isNetworkError) {
    showErrorToast({
      title: "Connection failed",
      description:
        "Unable to reach the backend. Check your connection and try again.",
      duration: 7000,
    });
  } else if (isServerError) {
    showErrorToast({
      title: "Server error",
      description:
        "The backend is currently unavailable. Please try again later.",
      duration: 7000,
    });
  }
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses and backend failures globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleBackendError(error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      window.location.href =
        "/login?message=Session expired. Please login again.";
    }

    return Promise.reject(error);
  },
);

export default api;
