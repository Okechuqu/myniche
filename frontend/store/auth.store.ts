import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  niche: string;
  main_platform: string;
  creator_goal: string;
  avatar: string;
  provider: string;
  plan_name: string;
  script_quota: number;
  has_usable_password: boolean;
  created_at?: string;
}

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  logout: () => void;
  setSession: (payload: {
    access: string;
    refresh: string;
    user: AuthUser;
  }) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setAccess: (access: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

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

const getAccessCookie = () => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${ACCESS_COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.slice(ACCESS_COOKIE_NAME.length + 1)) : null;
};

const storage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return window.localStorage;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      user: null,
      hasHydrated: false,

      setSession: ({ access, refresh, user }) => {
        setAccessCookie(access);
        set({
          access,
          refresh,
          user,
        });
      },

      setUser: (user) =>
        set({
          user,
        }),

      logout: () => {
        clearAccessCookie();
        set({
          access: null,
          refresh: null,
          user: null,
        });
      },

      setHasHydrated: (hydrated) =>
        set({
          hasHydrated: hydrated,
        }),

      clearSession: () => {
        clearAccessCookie();
        set({
          access: null,
          refresh: null,
          user: null,
        });
      },

      setAccess: (access) =>
        set({
          access,
        }),
    }),
    {
      name: "reelsdraft-auth",
      version: 2,
      storage: createJSONStorage(storage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.setAccess(getAccessCookie());
      },
    },
  ),
);
