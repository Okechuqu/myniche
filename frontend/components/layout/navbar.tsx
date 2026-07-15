"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { clearTokens } from "@/lib/auth";
import ThemeToggle from "@/components/shared/theme-toggle";

export default function Navbar() {
  const router = useRouter();
  const access = useAuthStore((s) => s.access);
  const logout = useAuthStore((s) => s.logout);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    clearTokens();
    logout();
    router.push("/");
  };

  return (
    <header className="w-full flex items-center justify-end gap-4 mb-6">
      <ThemeToggle />
      {hydrated && !access && (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] text-white text-sm"
          >
            Sign Up
          </Link>
        </div>
      )}

      {hydrated && access && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg border border-slate-700 text-sm"
        >
          Logout
        </button>
      )}
    </header>
  );
}
