"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  UserRound,
  Wrench,
  Sparkles,
  BarChart3,
  Group,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import ThemeToggle from "@/components/shared/theme-toggle";

const links = [
  { name: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { name: "Scripts", href: "/scripts", Icon: FileText },
  { name: "Script History", href: "/scripts/history", Icon: History },
  { name: "Planner", href: "/planner", Icon: CalendarDays },
  { name: "Tools", href: "/tools", Icon: Wrench },
  { name: "Profile", href: "/profile", Icon: UserRound },
  { name: "Settings", href: "/settings", Icon: Settings },
];

const comingSoonItems = [
  { name: "Analytics", Icon: BarChart3 },
  { name: "Repurpose AI", Icon: Sparkles },
  { name: "Hook Analyzer", Icon: Sparkles },
  { name: "Team Workspace", Icon: Group },
  { name: "Billing", Icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  const initial = user?.username?.charAt(0).toUpperCase() || "U";

  const sidebarContent = (
    <>
      <div
        className={[
          "flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] px-4",
          isCollapsed ? "md:border-transparent" : "",
        ].join(" ")}
      >
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex min-w-0 items-center gap-3"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#d4af37] via-[#3b82f6] to-[#05070b] text-white shadow-lg shadow-[#d4af37]/20 transition group-hover:scale-105">
            <span className="text-lg font-semibold">N</span>
          </span>
          <div
            className={[
              "min-w-0 transition-all duration-300",
              isCollapsed ? "block md:hidden" : "block",
            ].join(" ")}
          >
            <p className="text-base font-semibold text-[var(--foreground)]">
              MyNiche
            </p>
            <p className="theme-muted text-xs">AI script growth hub</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={[
              "transition-opacity duration-200",
              isCollapsed ? "inline-flex md:hidden" : "inline-flex",
            ].join(" ")}
          >
            <ThemeToggle compact />
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="theme-action-secondary inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>

          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="theme-action-secondary hidden h-10 w-10 items-center justify-center rounded-2xl border transition md:inline-flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="theme-action-secondary hidden h-10 w-10 items-center justify-center rounded-2xl border transition md:inline-flex md:border-transparent md:bg-transparent"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
        <div
          className={[
            "theme-muted px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em]",
            isCollapsed ? "block md:hidden" : "block",
          ].join(" ")}
        >
          Workspace
        </div>
        <div className="space-y-2">
          {links.map(({ name, href, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={name}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "group relative flex items-center gap-3 overflow-visible rounded-3xl border px-3 py-3 text-sm font-medium transition-all duration-300",
                  active
                    ? `border-[#d4af37]/30 bg-[var(--accent-soft)] text-[var(--foreground)] ${!isCollapsed ? "shadow-[0_15px_40px_-20px_rgba(212,175,55,0.35)]" : "md:border-transparent md:bg-transparent md:shadow-none"}`
                    : "theme-muted border-transparent hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]",
                  isCollapsed
                    ? "justify-start md:justify-center"
                    : "justify-start",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
                    active
                      ? "bg-[var(--accent-soft)] text-[#d4af37]"
                      : "theme-icon-tile group-hover:text-[#3b82f6]",
                  ].join(" ")}
                >
                  <Icon size={18} />
                </span>

                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                    isCollapsed
                      ? "max-w-48 opacity-100 md:max-w-0 md:opacity-0"
                      : "max-w-48 opacity-100"
                  }`}
                >
                  {name}
                </span>

                {isCollapsed && (
                  <span className="theme-surface theme-elevated pointer-events-none absolute left-full top-1/2 z-50 hidden -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-semibold md:group-hover:inline-flex">
                    {name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div
          className={[
            "mt-6 rounded-[1.75rem] border p-4 transition-all duration-300",
            "theme-surface-soft",
            isCollapsed ? "block md:hidden" : "block",
          ].join(" ")}
        >
          <p className="theme-muted mb-3 text-[10px] uppercase tracking-[0.3em]">
            Coming Soon
          </p>
          <div className="space-y-2">
            {comingSoonItems.map(({ name, Icon }) => (
              <div
                key={name}
                className="theme-muted flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
              >
                <span className="theme-icon-tile flex h-9 w-9 items-center justify-center rounded-2xl">
                  <Icon size={16} />
                </span>
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={[
          "shrink-0 border-t border-[var(--border)] px-3 py-4",
          isCollapsed ? "md:hidden" : "",
        ].join(" ")}
      >
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="theme-action-secondary flex h-11 w-full items-center justify-center gap-2 rounded-3xl border px-3 text-xs font-semibold uppercase tracking-[0.18em] transition"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
            {!isCollapsed && "Collapse"}
          </button>
        </div>

        {user && (
          <div
            className={[
              "relative mt-0 md:mt-4",
              isCollapsed ? "block md:hidden" : "block",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="theme-action-secondary flex w-full items-center gap-3 rounded-3xl border px-3 py-3 text-left transition"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#d4af37]/20 to-[#3b82f6]/20 text-sm font-semibold text-[#d4af37]">
                {initial}
              </span>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {user.username}
                </p>
                <p className="theme-muted truncate text-xs">
                  {user.plan_name === "free" ? "Free Plan" : user.plan_name}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`theme-muted transition-transform ${profileOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="theme-surface theme-elevated absolute bottom-full right-0 z-50 mb-2 w-full overflow-hidden rounded-3xl border backdrop-blur-xl">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setProfileOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                  >
                    <UserRound size={16} className="theme-muted" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => {
                      setProfileOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                  >
                    <Settings size={16} className="theme-muted" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 transition hover:bg-[var(--surface-strong)]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={[
          "theme-action-secondary fixed left-4 top-4 z-[70] h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur md:hidden",
          mobileOpen ? "hidden" : "inline-flex",
        ].join(" ")}
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      <div
        className={[
          "fixed inset-0 z-40 bg-[var(--overlay)] backdrop-blur-sm transition-opacity duration-300 ease-out md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={[
          "theme-surface-strong theme-elevated fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[340px] flex-col border-r backdrop-blur-xl transition-transform duration-300 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {sidebarContent}
      </aside>

      <aside
        className={[
          "hidden md:sticky md:top-0 md:z-30 md:flex md:h-screen",
          "flex-col border-r border-[var(--border)] text-[var(--foreground)] backdrop-blur-xl transition-all duration-300 ease-out",
          isCollapsed
            ? "md:w-16 md:border-transparent md:bg-transparent md:shadow-none"
            : "theme-surface-strong theme-elevated md:w-72",
          "shrink-0",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
