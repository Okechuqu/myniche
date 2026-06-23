"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  History,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  Wrench,
  X,
  Sparkles,
  BarChart3,
  Group,
  CreditCard,
} from "lucide-react";
import ProfileDropdown from "./profile-dropdown";
import { useAuthStore } from "@/store/auth.store";

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
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          className="bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-xl font-bold text-transparent"
        >
          MyNiche
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-900 text-white hover:border-slate-600"
          aria-label="Open sidebar"
          type="button"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close overlay"
          type="button"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex min-h-screen w-[min(22rem,calc(100vw-1.5rem))] flex-col border-r border-slate-800 bg-slate-950
          transform transition-all duration-300 ease-out
          md:sticky md:top-0 md:z-30 md:w-64 md:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"}
        `}
      >
        {/* Header with logo and close */}
        <div className="flex items-center justify-between border-b border-slate-800/50 px-5 py-4">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent"
          >
            MyNiche
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-900 text-white hover:border-slate-600 md:hidden"
            aria-label="Close sidebar"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Profile dropdown at top — only when logged in */}
          {user && (
            <div className="border-b border-slate-800/50 px-4 py-4">
              <ProfileDropdown />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 px-3 py-4">
            {links.map(({ name, href, Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "border border-pink-400/30 bg-pink-500/10 text-white shadow-sm shadow-pink-500/5"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active ? "bg-pink-500/15 text-pink-300" : "text-slate-500"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Coming Soon section */}
          <div className="border-t border-slate-800/50 px-4 py-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Coming Soon
            </p>
            <div className="space-y-1">
              {comingSoonItems.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 text-slate-600">
                    <Icon size={16} />
                  </span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
