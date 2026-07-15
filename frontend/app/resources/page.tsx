"use client";

import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Cpu,
  FileText,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

const resourceCards = [
  {
    title: "Beginner Creator Guide",
    description:
      "Set your niche, content pillars, and first repeatable publishing rhythm.",
    category: "Foundation",
    duration: "12 min",
    status: "Start here",
    Icon: BookOpen,
  },
  {
    title: "Script Writing Frameworks",
    description:
      "Use hooks, story arcs, and call-to-action patterns that fit short-form and long-form content.",
    category: "Writing",
    duration: "9 min",
    status: "Template pack",
    Icon: FileText,
  },
  {
    title: "Content Planning Guide",
    description:
      "Map ideas into a weekly schedule so your planner turns into a real production system.",
    category: "Planning",
    duration: "10 min",
    status: "Planner ready",
    Icon: CalendarDays,
  },
  {
    title: "Free Creator Tools Directory",
    description:
      "A focused list of research, editing, analytics, and workflow tools for solo creators.",
    category: "Tools",
    duration: "7 min",
    status: "Curated",
    Icon: Wrench,
  },
];

const systemSteps = [
  {
    label: "Pick a niche signal",
    copy: "Turn broad interests into focused content lanes.",
    Icon: Target,
  },
  {
    label: "Generate repeatable formats",
    copy: "Transform the signal into hooks, scripts, and reusable structures.",
    Icon: Sparkles,
  },
  {
    label: "Ship through a rhythm",
    copy: "Use a weekly cadence to keep ideas moving into published work.",
    Icon: Cpu,
  },
];

export default function ResourcesPage() {
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const isAuthenticated = Boolean(user || access);
  const ctaHref = isAuthenticated ? "/scripts" : "/demo";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute inset-x-4 top-10 h-40 bg-linear-to-r from-[#d4af37]/10 via-[#3b82f6]/10 to-[#05070b]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                Playbooks for building a sharper creator system.
              </h1>
              <p className="theme-muted mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                Browse concise guides for idea generation, script structure,
                planning, and creator tooling. Each resource is built to move
                quickly from reading to action.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {systemSteps.map(({ label, copy, Icon }) => (
                <div
                  key={label}
                  className="rounded-lg bg-[var(--surface-soft)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur"
                >
                  <Icon size={18} className="text-[var(--accent-secondary)]" />
                  <p className="mt-4 text-sm font-semibold">{label}</p>
                  <p className="theme-muted mt-2 text-xs leading-5">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {resourceCards.map(
              ({ title, description, category, duration, status, Icon }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-lg bg-[var(--surface-soft)] p-5 shadow-[0_24px_70px_-50px_rgba(212,175,55,0.75)] backdrop-blur transition hover:-translate-y-1"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-r from-[#d4af37]/10 via-[#3b82f6]/10 to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="theme-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                      <Icon size={19} />
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                      {status}
                    </span>
                  </div>

                  <div className="relative mt-6">
                    <div className="theme-muted flex flex-wrap items-center gap-2 text-xs uppercase">
                      <span>{category}</span>
                      <span aria-hidden="true">/</span>
                      <span>{duration}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold">{title}</h2>
                    <p className="theme-muted mt-3 text-sm leading-6">
                      {description}
                    </p>
                  </div>

                  <div className="relative mt-6 flex items-center justify-between gap-3">
                    <span className="theme-muted text-xs uppercase">
                      Resource brief
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-[var(--accent)] transition group-hover:translate-x-1"
                    />
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="mt-8 rounded-lg bg-[var(--surface)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Turn a guide into output
                </p>
                <p className="theme-muted mt-1 text-sm leading-6">
                  Use these resources with the dashboard planner and script
                  generator to move from learning to publishing.
                </p>
              </div>
              <Link
                href={ctaHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
              >
                Create a script
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
