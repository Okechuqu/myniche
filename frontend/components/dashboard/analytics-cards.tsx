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
      <div className="mt-6">
        <MyNicheEmptyState />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, Icon }) => (
          <div
            key={title}
            className="rounded-lg border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">{title}</p>
              <Icon size={18} className="text-pink-300" />
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              {isLoading ? "..." : value}
            </h2>
          </div>
        ))}
      </div>

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          Dashboard data could not be loaded.
        </div>
      )}

      {data?.recent_scripts.length ? (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">Recent scripts</h2>
          <div className="mt-4 divide-y divide-slate-800">
            {data.recent_scripts.map((script) => (
              <div
                key={script.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-100">{script.title}</p>
                  <p className="text-sm text-slate-400">{script.platform}</p>
                </div>
                <time className="text-xs text-slate-500">
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
