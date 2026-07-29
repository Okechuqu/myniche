import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import PricingCta from "@/components/pricing/pricing-cta";

const plans = [
  {
    title: "Free",
    price: "$0/mo",
    description: "Everything currently available in ReelsDraft.",
    features: [
      "20 scripts / month",
      "Individual creator workspace",
      "Script history",
      "Content planner",
      "Standard support",
    ],
    accent: true,
    available: true,
  },
  {
    title: "Creator",
    price: "Upcoming",
    description: "A planned upgrade for creators who need more capacity.",
    features: [
      "Higher monthly script allowance",
      "Enhanced planning workflows",
      "Priority support options",
    ],
    accent: false,
    available: false,
  },
  {
    title: "Agency",
    price: "Upcoming",
    description: "Team and agency capabilities are still in development.",
    features: [
      "Team workspace",
      "Shared content operations",
      "Agency administration",
    ],
    accent: false,
    available: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="theme-muted mt-3 max-w-2xl">
            Start free today. Paid plans will launch when their features are
            ready.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
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
                    <div className="theme-muted text-xs">
                      {plan.available ? "Free to use" : "Not yet available"}
                    </div>
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
                  <PricingCta
                    available={plan.available}
                    accent={plan.accent}
                  />
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
