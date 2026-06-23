"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { clearTokens } from "@/lib/auth";

export default function PublicNavbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearTokens();
    logout();
    router.push("/");
  };

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/tools", label: "Tools" },
    { href: "/pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/privacy", label: "Privacy" },
  ];

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-700 p-1 pr-3 text-sm text-white hover:bg-slate-900 transition"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-sm font-bold text-white">
                  {initials}
                </span>
                <ChevronDown
                  size={14}
                  className={open ? "rotate-180 transition" : "transition"}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
                  <div className="border-b border-slate-700 px-3 py-2 text-sm text-slate-400">
                    {user.email}
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition"
                  >
                    <UserRound size={16} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-block rounded-lg border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden md:inline-block rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-2 text-sm font-medium text-white"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden block"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur">
          <div className="flex h-full transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex flex-col w-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  MyNiche
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={24} className="text-white" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-slate-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm text-white hover:bg-slate-900"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-2 text-center text-sm font-medium text-white"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
