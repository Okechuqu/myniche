"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import {
  LayoutDashboard,
  FileText,
  History,
  CalendarDays,
  Wrench,
  UserRound,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { href: "/scripts", label: "Scripts", Icon: FileText },
  { href: "/scripts/history", label: "History", Icon: History },
  { href: "/planner", label: "Planner", Icon: CalendarDays },
  { href: "/tools", label: "Tools", Icon: Wrench },
  { href: "/profile", label: "Profile", Icon: UserRound },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden px-4 pb-28 pt-24 sm:px-6 sm:pb-32 md:px-8 md:pb-10 md:pt-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          {navItems.slice(0, 5).map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[0] flex-1 flex-col items-center justify-center rounded-3xl px-2 py-2 text-xs font-semibold transition ${
                pathname === href
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "theme-muted hover:bg-[var(--surface-strong)]"
              }`}
            >
              <Icon size={18} />
              <span className="mt-1 truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
