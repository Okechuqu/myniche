import { useAuthStore } from "@/store/auth.store";

const ACCESS_COOKIE_NAME = "access";
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const setAccessCookie = (access: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ACCESS_COOKIE_NAME}=${encodeURIComponent(
    access,
  )}; Path=/; Max-Age=${ACCESS_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};

const clearAccessCookie = () => {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ACCESS_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
};

export const setTokens = (access: string, refresh: string) => {
  setAccessCookie(access);

  // also update zustand store
  try {
    useAuthStore.setState({ access, refresh });
  } catch {
    // ignore (server-side or before store initialization)
  }
};

export const clearTokens = () => {
  clearAccessCookie();

  try {
    useAuthStore.getState().logout();
  } catch {
    // ignore
  }
};

export const getAccessToken = () => useAuthStore.getState().access;
