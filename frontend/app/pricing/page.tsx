"use client";

import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/services/api/plans.api";

const defaultPlans = [
  {
    title: "Free",
    price: "$0/mo",
    description: "Start with a limited creator workspace.",
    features: [
      "20 scripts / month",
      "1 seat (individual)",
      "Standard support",
      "Basic planner & analytics",
    ],
    accent: true,
  },
  {
    title: "Creator",
    price: "$19/mo",
    description: "Unlimited scripts, planner, and pro workflows.",
    features: [
      "Unlimited scripts",
      "Up to 5 seats",
      "Priority support",
      "Advanced planner & workflow automations",
    ],
    accent: false,
  },
  {
    title: "Agency",
    price: "$49/mo",
    description: "Team collaboration, analytics, and growth tools.",
    features: [
      "Unlimited scripts & seats",
      "Team workspace & roles",
      "Advanced analytics",
      "White-labeling & SSO",
    ],
    accent: false,
  },
];

export default function PricingPage() {
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: 60 * 1000,
  });

  const plans = data ?? defaultPlans;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="theme-muted mt-3 max-w-2xl">
            Simple pricing that scales with creators and teams.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plans.map((plan: any) => (
              <div
                key={plan.title}
                className={`rounded-[1.5rem] border p-6 ${plan.accent ? "theme-surface theme-accent-border" : "theme-surface-soft"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{plan.title}</h3>
                    <p className="theme-muted text-sm">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{plan.price}</div>
                    <div className="theme-muted text-xs">Billed monthly</div>
                  </div>
                </div>

                <ul className="theme-muted mt-6 space-y-3 text-sm">
                  {plan.features?.map((f: string) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href={
                      plan.title === "Free"
                        ? "/(auth)/register"
                        : `/pricing?plan=${plan.title.toLowerCase()}`
                    }
                    className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold ${plan.accent ? "bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] text-white" : "theme-action-secondary border"}`}
                  >
                    {plan.title === "Free"
                      ? "Get Free"
                      : `Choose ${plan.title}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
