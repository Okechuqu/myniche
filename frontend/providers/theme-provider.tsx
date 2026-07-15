"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "myniche-theme";
const THEME_CHANGE_EVENT = "myniche-theme-change";
const DEFAULT_THEME: Theme = "dark";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
}

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;

  const root = document.documentElement;
  if (root.classList.contains("light")) return "light";
  if (root.classList.contains("dark")) return "dark";

  return getStoredTheme() ?? DEFAULT_THEME;
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;

    applyTheme(isTheme(event.newValue) ? event.newValue : DEFAULT_THEME);
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    applyTheme(getStoredTheme() ?? DEFAULT_THEME);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyTheme(newTheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Keep the visible theme change even if storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
