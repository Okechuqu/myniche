import { useAuthStore } from "@/store/auth.store";

const ACCESS_COOKIE_NAME = "access";
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24;

const setAccessCookie = (access: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ACCESS_COOKIE_NAME}=${encodeURIComponent(
    access,
  )}; Path=/; Max-Age=${ACCESS_COOKIE_MAX_AGE}; SameSite=Lax`;
};

const clearAccessCookie = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ACCESS_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  setAccessCookie(access);

  // also update zustand store
  try {
    useAuthStore.setState({ access, refresh });
  } catch {
    // ignore (server-side or before store initialization)
  }
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  clearAccessCookie();

  try {
    useAuthStore.getState().logout();
  } catch {
    // ignore
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("access");
};
