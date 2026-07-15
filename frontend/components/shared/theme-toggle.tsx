"use client";

import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
  compact?: boolean;
};

const switchBase =
  "group relative inline-grid h-10 w-[4.25rem] grid-cols-2 items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1 text-[var(--text-muted)] shadow-sm transition duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none";

const compactBase =
  "group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] shadow-sm transition duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none";

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (!hydrated) {
    return (
      <button
        type="button"
        className={compact ? compactBase : switchBase}
        aria-label="Theme preference loading"
        disabled
      >
        <span className="col-span-2 mx-auto h-4 w-4 rounded-full bg-[var(--border)]" />
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={compactBase}
        aria-label={label}
        title={label}
      >
        <span
          className={[
            "absolute inset-1 rounded-xl bg-linear-to-br opacity-20 transition duration-300 motion-reduce:transition-none",
            isDark
              ? "from-[#d4af37] via-[#3b82f6] to-[#05070b]"
              : "from-[#b88a00] via-[#2563eb] to-[#0b0c0f]",
          ].join(" ")}
        />
        <span className="relative transition duration-300 group-hover:scale-110 motion-reduce:transition-none">
          {isDark ? (
            <Sun size={18} className="text-[#d4af37]" />
          ) : (
            <Moon size={18} className="text-[#2563eb]" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={switchBase}
      role="switch"
      aria-label={label}
      aria-checked={isDark}
      title={label}
    >
      <span
        className={[
          "absolute left-1 top-1 h-8 w-8 rounded-full bg-[var(--surface)] shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out motion-reduce:transition-none",
          isDark ? "translate-x-7" : "translate-x-0",
        ].join(" ")}
      />

      <span
        className={[
          "relative z-10 flex items-center justify-center rounded-full transition-colors duration-300 motion-reduce:transition-none",
          isDark ? "text-slate-500" : "text-[#b88a00]",
        ].join(" ")}
        aria-hidden="true"
      >
        <Sun size={16} />
      </span>

      <span
        className={[
          "relative z-10 flex items-center justify-center rounded-full transition-colors duration-300 motion-reduce:transition-none",
          isDark ? "text-[#2563eb]" : "text-slate-500",
        ].join(" ")}
        aria-hidden="true"
      >
        <Moon size={16} />
      </span>
    </button>
  );
}
