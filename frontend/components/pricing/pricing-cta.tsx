"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function PricingCta({
  available,
  accent,
}: {
  available: boolean;
  accent: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const isAuthenticated = Boolean(user || access);

  return (
    <Link
      href={isAuthenticated ? "/dashboard" : "/register"}
      className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold ${
        accent
          ? "bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] text-white"
          : "theme-action-secondary border"
      }`}
    >
      {isAuthenticated
        ? "Continue to workspace"
        : available
          ? "Create free account"
          : "Start with Free"}
    </Link>
  );
}
