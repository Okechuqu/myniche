"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, CalendarCheck, FileText, Target } from "lucide-react";

import MyNicheEmptyState from "@/components/shared/myniche-empty-state";
import { getAnalyticsSummary } from "@/services/api/analytics.api";

const numberFormat = new Intl.NumberFormat("en");

export default function AnalyticsCards() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: getAnalyticsSummary,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const cards = [
    {
      title: "Total scripts",
      value: data ? numberFormat.format(data.totals.scripts) : "0",
      Icon: FileText,
    },
    {
      title: "Weekly output",
      value: data ? numberFormat.format(data.totals.weekly_scripts) : "0",
      Icon: CalendarCheck,
    },
    {
      title: "Consistency",
      value: data ? `${data.totals.consistency_score}%` : "0%",
      Icon: Target,
    },
    {
      title: "Views tracked",
      value: data ? numberFormat.format(data.totals.views) : "0",
      Icon: BarChart3,
    },
  ];

  const isEmpty =
    !isLoading &&
    !isError &&
    data &&
    data.totals.scripts === 0 &&
    data.totals.planned_items === 0 &&
    data.totals.views === 0;

  if (isEmpty) {
    return (
      <div className="theme-surface-soft theme-elevated mt-6 rounded-[2rem] border p-6">
        <MyNicheEmptyState />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {cards.map(({ title, value, Icon }, index) => (
          <div
            key={title}
            className={`rounded-[2rem] border p-5 shadow-sm transition ${
              index === 1
                ? "theme-surface theme-accent-border bg-[var(--accent-soft)]"
                : "theme-surface"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="theme-muted text-sm">{title}</p>
              <Icon size={18} className="text-[var(--accent)]" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
              {isLoading ? "..." : value}
            </h2>
          </div>
        ))}
      </div>

      {isError && (
        <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-500">
          Dashboard data could not be loaded.
        </div>
      )}

      {data?.recent_scripts.length ? (
        <section className="theme-surface rounded-[2rem] border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent scripts
          </h2>
          <div className="mt-5 divide-y divide-[var(--border)]">
            {data.recent_scripts.map((script) => (
              <div
                key={script.id}
                className="flex flex-col gap-2 border-b border-[var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {script.title}
                  </p>
                  <p className="theme-muted text-sm">{script.platform}</p>
                </div>
                <time className="theme-muted text-xs uppercase tracking-[0.3em]">
                  {new Date(script.created_at).toLocaleDateString()}
                </time>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
