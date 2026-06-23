"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { clearTokens } from "@/lib/auth";

export default function ProfileDropdown() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearTokens();
    logout();
    setOpen(false);
    router.push("/");
  };

  // Close on click outside
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  if (!user) return null;

  const initial = user.username?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={dropdownRef} onBlur={handleBlur} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        className="flex w-full items-center gap-3 rounded-xl border-2 border-slate-700 bg-slate-900 px-3 py-2.5 text-left transition hover:border-slate-600 hover:bg-slate-800"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-pink-500 bg-pink-500/20 text-sm font-bold text-pink-300">
          {initial}
        </span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.username}
          </p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-900 shadow-xl shadow-black/40">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <UserRound size={16} className="text-slate-400" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <Settings size={16} className="text-slate-400" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-slate-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
