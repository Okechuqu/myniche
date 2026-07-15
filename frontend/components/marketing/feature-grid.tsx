import {
  Archive,
  BarChart3,
  Calendar,
  CalendarDays,
  Lightbulb,
  Sparkles,
  Wrench,
} from "lucide-react";

interface FeatureGridCard {
  title: string;
  description: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  accent?: string;
}

interface FeatureGridProps {
  features?: FeatureGridCard[];
}

const defaultFeatures: FeatureGridCard[] = [
  {
    title: "AI Script Generator",
    description: "Generate niche-specific content scripts instantly.",
    icon: Sparkles,
  },
  {
    title: "Content Planner",
    description: "Weekly and monthly planning system.",
    icon: CalendarDays,
  },
  {
    title: "Creator Toolkit",
    description: "Curated creator software recommendations.",
    icon: Wrench,
  },
  {
    title: "Idea Vault",
    description: "Store and organize content ideas.",
    icon: Lightbulb,
  },
  {
    title: "Content Calendar",
    description: "Schedule and track content production.",
    icon: Calendar,
  },
  {
    title: "Analytics",
    description: "Track consistency and publishing habits.",
    icon: BarChart3,
  },
];

export default function FeatureGrid({ features }: FeatureGridProps) {
  const featureItems = features ?? defaultFeatures;

  return (
    <section className="px-6 py-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="theme-surface-soft theme-elevated rounded-[2rem] border px-6 py-12 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
              A suite of tools built for modern creator workflows.
            </h2>
            <p className="theme-muted mx-auto mt-5 max-w-2xl">
              Everything from idea collection to content delivery is designed to
              keep your process fast, visual, and reliable.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureItems.map((feature) => {
              const Icon = feature.icon ?? Sparkles;
              return (
                <div
                  key={feature.title}
                  className="theme-surface group rounded-[2rem] border p-8 transition hover:-translate-y-1 hover:border-[var(--accent)]/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4af37]/20 to-[#3b82f6]/10">
                    <Icon size={22} className="text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <p className="theme-muted mt-3">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
