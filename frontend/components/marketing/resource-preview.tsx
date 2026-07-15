import { ElementType } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Sparkles } from "lucide-react";

interface ResourceCard {
  icon?: ElementType;
  title: string;
  description: string;
}

interface ResourcePreviewProps {
  heading?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  featureCards?: ResourceCard[];
}

const defaultFeatureCards: ResourceCard[] = [
  {
    icon: Sparkles,
    title: "AI creative recipes",
    description:
      "Browse instant prompts, templates, and frameworks built for modern creators.",
  },
  {
    icon: BookOpen,
    title: "Research vault",
    description:
      "Access curated resources, case studies, and growth playbooks in one place.",
  },
  {
    icon: Cpu,
    title: "Performance insights",
    description:
      "Turn creator metrics into action with smart guidance and planning tips.",
  },
];

const defaultFeatureIcons = [Sparkles, BookOpen, Cpu];

export default function ResourcePreview({
  heading = "High-tech creative resources built for every stage of your launch.",
  description = "Discover exclusive creator workflows, AI prompt recipes, and dynamic tools to help you write faster, plan smarter, and stay ahead.",
  actionLabel = "Explore resources",
  actionHref = "/resources",
  featureCards = defaultFeatureCards,
}: ResourcePreviewProps) {
  return (
    <section className="px-6 py-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              {heading}
            </h2>
            <p className="theme-muted max-w-2xl">{description}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={actionHref}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {actionLabel}
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="theme-action-secondary inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {featureCards.map((card, index) => {
              const Icon =
                card.icon ??
                defaultFeatureIcons[index % defaultFeatureIcons.length];
              return (
                <div
                  key={card.title}
                  className="theme-surface theme-elevated group relative overflow-hidden rounded-[2rem] border p-8 transition hover:-translate-y-1"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[var(--accent-soft)] blur-2xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="theme-icon-tile flex h-12 w-12 items-center justify-center rounded-3xl">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      <p className="theme-muted mt-2">{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
