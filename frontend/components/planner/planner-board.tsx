"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import MyNicheEmptyState from "@/components/shared/myniche-empty-state";
import { getCurrentPlans } from "@/services/api/planner.api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PlannerBoard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["planner-current"],
    queryFn: getCurrentPlans,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const plan =
    data && !("missing_niche" in data) ? (data.weekly ?? data.monthly) : null;
  const items = (plan?.items ?? []).filter((item) => item.day_name);

  if (data && "missing_niche" in data) {
    return (
      <div className="space-y-4">
        <MyNicheEmptyState
          title="Planner needs your niche"
          description="Add your creator niche on the profile page so MyNiche can generate weekly planner ideas tailored to your brand."
        />
        <div className="flex justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Go to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plan ? (
        <div className="theme-surface rounded-2xl border p-4 text-sm">
          <p className="font-semibold text-[var(--foreground)]">
            {plan.title || "Current content plan"}
          </p>
          <p className="theme-muted mt-1">
            {plan.niche} • {plan.platform}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-7 lg:grid-cols-2">
        {days.map((day) => {
          const dayItems = items.filter((item) => item.day_name === day);

          return (
            <div key={day} className="theme-surface rounded-2xl border p-4">
              <h3 className="mb-3 font-semibold text-[var(--foreground)]">
                {day}
              </h3>

              {isLoading ? (
                <div className="theme-muted text-sm">Loading plan...</div>
              ) : isError ? (
                <div className="theme-muted text-sm">
                  Unable to load plan right now.
                </div>
              ) : dayItems.length > 0 ? (
                <div className="space-y-2">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="theme-surface-soft rounded-lg border px-3 py-2 text-sm"
                    >
                      {item.topic}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="theme-muted text-sm">No content planned</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
