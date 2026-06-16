import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  niche: string;
  creator_goal: string;
  avatar: string;
  provider: string;
  plan_name: string;
  script_quota: number;
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
  setHasHydrated: (hydrated: boolean) => void;
}

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
    }),
    {
      name: "myniche-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.access) {
          setAccessCookie(state.access);
        } else {
          clearAccessCookie();
        }
      },
    },
  ),
);
