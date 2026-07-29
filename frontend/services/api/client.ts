import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { showErrorToast } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api-error";

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
    console.error("[API] Network request failed", error);
    showErrorToast({
      title: "Unable to connect",
      description: getApiErrorMessage(error),
      duration: 7000,
    });
    return;
  }

  const status = response.status;
  console.error(
    `[API] ${error.config?.method?.toUpperCase() ?? "REQUEST"} ${
      error.config?.url ?? ""
    } failed with status ${status}`,
    response.data,
  );

  showErrorToast({
    title: status >= 500 ? "Service unavailable" : "Unable to continue",
    description: getApiErrorMessage(error),
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
