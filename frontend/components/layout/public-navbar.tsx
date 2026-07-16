"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UserRound,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Wrench,
  CircleDollarSign,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { clearTokens } from "@/lib/auth";
import ThemeToggle from "@/components/shared/theme-toggle";

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
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

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    clearTokens();
    logout();
    router.push("/");
  };

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const navLinks = [
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/pricing", label: "Pricing", icon: CircleDollarSign },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur"
        style={{ backgroundColor: "var(--surface-strong)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] bg-clip-text text-transparent"
          >
            MyNiche
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                    isActive
                      ? "font-semibold text-[var(--foreground)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle compact />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--foreground)] transition hover:border-[var(--accent)] md:hidden"
              style={{ backgroundColor: "var(--surface-soft)" }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] p-1 pr-3 text-sm text-[var(--foreground)] transition"
                  style={{ backgroundColor: "var(--surface-soft)" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] text-sm font-bold text-white">
                    {initials}
                  </span>
                  <ChevronDown
                    size={14}
                    className={open ? "rotate-180 transition" : "transition"}
                  />
                </button>

                {open && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border)] p-2 shadow-xl"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    <div className="border-b border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)]">
                      {user.email}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]"
                    >
                      <UserRound size={16} />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-[var(--surface-soft)]"
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
                  className="hidden rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-soft)] md:inline-block"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-2 text-sm font-medium text-white md:inline-block"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "var(--overlay)" }}
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-[320px] flex-col border-r border-[var(--border)] p-5 shadow-2xl"
            style={{ backgroundColor: "var(--surface-strong)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Navigate
                </p>
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  MyNiche
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--foreground)] transition hover:border-[var(--accent)]"
                style={{ backgroundColor: "var(--surface-soft)" }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[var(--foreground)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isActive
                              ? "bg-[var(--accent-soft)] text-[#d4af37]"
                              : "bg-[var(--surface)] text-[#3b82f6]"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <span>{link.label}</span>
                      </span>
                      <ArrowRight
                        size={16}
                        className={`transition ${
                          isActive
                            ? "translate-x-1 text-[#d4af37]"
                            : "text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[#3b82f6]"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Theme
              </p>
              <div className="mt-3 flex items-center">
                <ThemeToggle compact />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[var(--border)] bg-linear-to-br from-[#d4af37]/15 via-[var(--surface-soft)] to-[#3b82f6]/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Connect
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
                    style={{ backgroundColor: "var(--surface-soft)" }}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]"
                      style={{ backgroundColor: "var(--surface-soft)" }}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-3 py-2 text-sm font-medium text-white"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
