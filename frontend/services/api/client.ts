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
  const response = error.response;

  // Network error (no response)
  if (!response) {
    showErrorToast({
      title: "Connection failed",
      description:
        "Unable to reach the backend. Check your connection and try again.",
      duration: 7000,
    });
    return;
  }

  const status = response.status;

  // Prefer a helpful description from the backend when available
  let description: string | undefined;
  const data = response.data;
  if (data) {
    if (typeof data === "string") {
      // If backend returned an HTML error page, avoid showing raw HTML; fall back to a concise status message
      if (data.trim().startsWith("<")) {
        description = `Request failed (${status})`;
      } else {
        description = data;
      }
    } else if (typeof data === "object") {
      try {
        description = Object.entries(data)
          .map(([key, value]) =>
            Array.isArray(value)
              ? `${key}: ${value.join(", ")}`
              : `${key}: ${value}`,
          )
          .join(" \n");
      } catch (e) {
        description = JSON.stringify(data);
      }
    }
  }

  // Distinguish server vs client errors for title wording
  const title = status >= 500 ? "Server error" : `Error ${status}`;

  showErrorToast({
    title,
    description:
      description ??
      (status >= 500
        ? "The backend is currently unavailable. Please try again later."
        : `Request failed (${status})`),
    duration: 7000,
  });
};

api.interceptors.request.use((config) => {
  const access = useAuthStore.getState().access;

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleBackendError(error);

    return Promise.reject(error);
  },
);

export default api;
