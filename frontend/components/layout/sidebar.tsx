"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Scripts", href: "/scripts" },
  { name: "Script History", href: "/scripts/history" },
  { name: "Planner", href: "/planner" },
  { name: "Tools", href: "/tools" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950 p-6">
      <h1 className="text-2xl font-bold bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
        MyNiche
      </h1>

      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`block rounded-lg px-4 py-3 text-sm transition ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Coming Soon
        </p>

        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <div>Analytics</div>
          <div>Repurpose AI</div>
          <div>Hook Analyzer</div>
          <div>Team Workspace</div>
          <div>Billing</div>
        </div>
      </div>
    </aside>
  );
}
