"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/services/api/plans.api";

interface PricingPlan {
  title: string;
  description: string;
  accent?: boolean;
  features?: string[];
}

interface PricingPreviewProps {
  plans?: PricingPlan[];
}

const defaultPlans: PricingPlan[] = [
  {
    title: "Free",
    description: "Start with a limited creator workspace.",
    accent: true,
    features: [
      "20 scripts / month",
      "1 seat (individual)",
      "Standard support",
      "Basic planner & analytics",
    ],
  },
  {
    title: "Creator",
    description: "Unlimited scripts, planner, and pro workflows.",
    accent: false,
    features: [
      "Unlimited scripts",
      "Up to 5 seats",
      "Priority support",
      "Advanced planner & workflow automations",
    ],
  },
  {
    title: "Agency",
    description: "Team collaboration, analytics, and growth tools.",
    accent: false,
    features: [
      "Unlimited scripts & seats",
      "Team workspace & roles",
      "Advanced analytics",
      "White-labeling & SSO",
    ],
  },
];

export default function PricingPreview({ plans }: PricingPreviewProps) {
  const { data } = useQuery<PricingPlan[]>({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: 60 * 1000,
  });

  const planItems = plans ?? data ?? defaultPlans;

  return (
    <section className="px-6 py-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {planItems.map((plan) => (
              <div
                key={plan.title}
                className={`rounded-[2rem] border p-8 shadow-2xl transition ${
                  plan.accent
                    ? "theme-surface theme-accent-border"
                    : "theme-surface-soft"
                }`}
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold">{plan.title}</h3>
                  {plan.accent && (
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                      Popular
                    </span>
                  )}
                </div>
                <p className="theme-muted">{plan.description}</p>
                <ul className="theme-muted mt-6 space-y-2 text-sm">
                  {plan.features?.map((f: any) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/pricing"
                    className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition ${
                      plan.accent
                        ? "bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] text-white"
                        : "theme-action-secondary border"
                    }`}
                  >
                    {plan.accent ? `Get ${plan.title}` : `Choose ${plan.title}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Flexible plans that scale with your creator journey.
            </h2>
            <p className="theme-muted max-w-2xl">
              Choose the plan that fits your workflow, whether you’re launching
              your first script or building a studio.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Explore full pricing
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
