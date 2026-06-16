"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function PublicNavbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent"
        >
          MyNiche
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/features"
            className="text-sm text-slate-300 hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/tools"
            className="text-sm text-slate-300 hover:text-white"
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-slate-300 hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/resources"
            className="text-sm text-slate-300 hover:text-white"
          >
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-900"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-2 text-sm font-medium text-white"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
