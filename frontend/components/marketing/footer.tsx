"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getSiteConfiguration,
  SiteConfiguration,
} from "@/services/api/public.api";
import { ArrowRight, Bot, Cpu, RadioTower, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

interface FooterSignal {
  label: string;
  value: string;
}

interface FooterProps {
  footerGroups?: FooterGroup[];
  footerSignals?: FooterSignal[];
}

const defaultFooterGroups: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Tools", href: "/tools" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const defaultFooterSignals: FooterSignal[] = [
  { label: "Script engine", value: "Online" },
  { label: "Trend radar", value: "Live" },
  { label: "Planner core", value: "Synced" },
];

const signalIconMap = [Bot, RadioTower, Cpu];

export default function Footer({
  footerGroups = defaultFooterGroups,
  footerSignals = defaultFooterSignals,
}: FooterProps) {
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const isAuthenticated = Boolean(user || access);
  const ctaHref = isAuthenticated ? "/dashboard" : "/register";
  const [siteConfig, setSiteConfig] = useState<SiteConfiguration | null>(null);

  useEffect(() => {
    let mounted = true;
    getSiteConfiguration()
      .then((data) => {
        if (mounted) setSiteConfig(data as SiteConfiguration);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="relative overflow-hidden bg-[var(--background)] px-4 py-12 text-[var(--foreground)] sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="pointer-events-none absolute inset-x-6 top-8 h-24 bg-linear-to-r from-[#d4af37]/10 via-[#3b82f6]/10 to-[#05070b]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-lg bg-[var(--surface-soft)] shadow-[0_28px_90px_-55px_rgba(212,175,55,0.75)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative p-5 sm:p-8">
            <h3 className="mt-5 max-w-2xl text-2xl font-semibold sm:mt-6 sm:text-4xl">
              Build sharper ideas before the feed moves on.
            </h3>
            <p className="theme-muted mt-4 max-w-xl text-sm leading-6 sm:mt-5 sm:text-base sm:leading-7">
              MyNiche connects scripts, planning, and creator intelligence into
              one responsive workspace for faster content decisions.
            </p>

            <div className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3">
              {footerSignals.map((item, index) => {
                const Icon = signalIconMap[index % signalIconMap.length];
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[var(--surface)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:block sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:justify-between">
                      <Icon size={18} className="text-[#3b82f6]" />
                      <div className="min-w-0 sm:hidden">
                        <p className="theme-muted truncate text-xs uppercase">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>

                    <p className="theme-muted mt-5 hidden text-xs uppercase sm:block">
                      {item.label}
                    </p>
                    <p className="mt-1 hidden text-sm font-semibold sm:block">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid content-between gap-6 p-5 sm:gap-8 sm:p-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="theme-muted bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase">
                    {group.title}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center justify-between gap-3 py-2 text-sm text-[var(--foreground)] transition hover:text-[#d4af37]"
                      >
                        <span>{link.label}</span>
                        <ArrowRight
                          size={15}
                          className="theme-muted transition group-hover:translate-x-1 group-hover:text-[#d4af37]"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-[var(--surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Launch your workspace</p>
                  <p className="theme-muted mt-1 text-sm">
                    Turn raw niche ideas into ready-to-publish scripts.
                  </p>
                </div>
                <Link
                  href={ctaHref}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-muted mt-6 flex flex-col items-center justify-between gap-2 pt-4 text-center text-xs sm:flex-row sm:items-center sm:pt-6 sm:text-left sm:text-sm">
          <div className="flex items-center justify-center gap-2 text-sm sm:justify-start">
            <p>
              © {new Date().getFullYear()} MyNiche. Crafted for ambitious
              creators.
            </p>
          </div>
          <div className="ml-4 flex flex-col text-xs">
            <span>
              Email: {siteConfig?.contact_email ?? "support@myniche.example"}
            </span>
            <span>
              Phone: {siteConfig?.contact_phone ?? "+1 (555) 123-4567"}
            </span>
          </div>
          <p className="uppercase">Content systems online</p>
        </div>
      </div>
    </footer>
  );
}
