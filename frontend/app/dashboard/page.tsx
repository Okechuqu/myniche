"use client";

import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AnalyticsCards from "@/components/dashboard/analytics-cards";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const planName = user?.plan_name ?? "free";
  const displayPlan =
    planName !== "free"
      ? planName.charAt(0).toUpperCase() + planName.slice(1)
      : "Free";

  return (
    <DashboardLayout>
      <div className="grid gap-8">
        <section className="theme-surface-soft theme-elevated rounded-[2rem] border p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Creator dashboard
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Welcome back{user?.username ? `, ${user.username}` : ""}
              </h1>
              <p className="theme-muted max-w-2xl text-sm leading-7 sm:text-base">
                Your central creator control room for scripts, planning, and
                day-to-day momentum.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/scripts"
                className="inline-flex items-center justify-center rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
              >
                Create a script
              </Link>
              <Link
                href="/scripts/history"
                className="theme-action-secondary inline-flex items-center justify-center rounded-3xl border px-5 py-3 text-sm font-semibold transition"
              >
                View history
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <section className="theme-surface theme-accent-border theme-elevated rounded-[2rem] border p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                    Featured plan
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
                    {displayPlan}
                  </h2>
                  <p className="theme-muted mt-2 max-w-xl">
                    {planName !== "free"
                      ? "Your active plan gives you unlimited script generation, priority queueing, and advanced planning tools."
                      : "You're currently on the Free plan. Upgrade anytime to unlock Pro features like priority queueing and advanced planning tools."}
                  </p>
                </div>
                <div className="rounded-3xl border border-[var(--accent)]/30 bg-gradient-to-br from-[#d4af37]/10 to-[#3b82f6]/10 px-5 py-4 text-center">
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                    Current tier
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                    {displayPlan}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Scripts/month",
                    value: planName !== "free" ? "Unlimited" : "20",
                  },
                  {
                    label: "Team seats",
                    value: planName !== "free" ? "5" : "1",
                  },
                  {
                    label: "Support",
                    value: planName !== "free" ? "Priority" : "Standard",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="theme-surface-soft rounded-3xl border p-4 text-sm"
                  >
                    <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <AnalyticsCards />
          </div>

          <aside className="space-y-6">
            <section className="theme-surface rounded-[2rem] border p-6 shadow-xl">
              <p className="theme-muted text-xs uppercase tracking-[0.28em]">
                Quick insights
              </p>
              <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                Today at a glance
              </h2>
              <ul className="theme-muted mt-6 space-y-4 text-sm">
                <li className="theme-surface-soft rounded-3xl border p-4">
                  <p className="font-semibold text-[var(--foreground)]">
                    Fast launch rhythm
                  </p>
                  <p className="mt-1">
                    Keep your next idea queued and ready to publish.
                  </p>
                </li>
                <li className="theme-surface-soft rounded-3xl border p-4">
                  <p className="font-semibold text-[var(--foreground)]">
                    Stay on track
                  </p>
                  <p className="mt-1">
                    Your latest metrics update automatically as you ship
                    content.
                  </p>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
