import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import {
  Calendar,
  CalendarDays,
  Sparkles,
  Wrench,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  {
    title: "AI Script Generator",
    description:
      "Turn rough ideas into polished scripts with adaptive prompts, tone control, and instant rewrites.",
    accent: "from-[#d4af37]/30 via-[#3b82f6]/20 to-transparent",
    icon: Sparkles,
  },
  {
    title: "Content Planner",
    description:
      "Map campaigns across channels with intelligent sequencing, publishing checkpoints, and creative briefs.",
    accent: "from-[#3b82f6]/30 via-sky-500/20 to-transparent",
    icon: CalendarDays,
  },
  {
    title: "Content Calendar",
    description:
      "Visualize launches in real time and keep publishing momentum aligned with your growth goals.",
    accent: "from-[#3b82f6]/30 via-[#d4af37]/20 to-transparent",
    icon: CalendarDays,
  },
  {
    title: "Creator Toolkit",
    description:
      "Move from idea to output faster with reusable assets, hooks, and audience-ready messaging blocks.",
    accent: "from-[#d4af37]/30 via-[#3b82f6]/20 to-transparent",
    icon: Wrench,
  },
  {
    title: "Analytics",
    description:
      "Understand what resonates with your audience through clear insights and optimized performance signals.",
    accent: "from-emerald-500/30 via-green-500/20 to-transparent",
    icon: BarChart3,
  },
  {
    title: "Team Collaboration",
    description:
      "Coordinate feedback, approvals, and launches effortlessly across your whole operation.",
    accent: "from-[#3b82f6]/30 via-[#d4af37]/20 to-transparent",
    icon: Users,
  },
];

export default function FeaturesPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden text-[var(--foreground)]"
      style={{ background: "var(--background)" }}
    >
      <PublicNavbar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-20">
        <div
          className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] p-5 shadow-[0_0_60px_rgba(244,114,182,0.12)] backdrop-blur-xl sm:rounded-4xl sm:p-8 lg:p-16"
          style={{ backgroundColor: "var(--surface-soft)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.2),transparent_30%)]" />

          <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:mt-6 sm:text-4xl lg:text-6xl">
                Build smarter stories with a
                <span className="block bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] bg-clip-text text-transparent">
                  futuristic content engine.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-base lg:text-lg lg:leading-8">
                From ideation to publishing, MyNiche gives creators a connected
                system for strategy, scripting, and momentum.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                <span className="rounded-full border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary-soft)] px-3 py-2 text-xs text-[var(--accent-secondary)] sm:px-4 sm:text-sm">
                  Instant generation
                </span>
                <span className="rounded-full border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary-soft)] px-3 py-2 text-xs text-[var(--accent-secondary)] sm:px-4 sm:text-sm">
                  Collaborative planning
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200 sm:px-4 sm:text-sm">
                  Live insights
                </span>
              </div>
            </div>

            <div
              className="rounded-3xl border border-[var(--border)] p-4 shadow-inner shadow-[var(--accent-secondary)]/10 sm:p-6"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div
                className="rounded-2xl border border-[var(--border)] p-4 sm:p-5"
                style={{ backgroundColor: "var(--surface-strong)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-secondary)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                  <div
                    className="rounded-2xl border border-[var(--border)] p-3 sm:p-4"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    <p className="text-xs text-[var(--text-muted)] sm:text-sm">
                      Live workflow
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--foreground)] sm:text-lg">
                      AI outline → script → publish
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-[var(--border)] p-3 sm:p-4"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    <p className="text-xs text-[var(--text-muted)] sm:text-sm">
                      Next unlock
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--foreground)] sm:text-lg">
                      Adaptive recommendations in real time
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-linear-to-r from-[#d4af37]/20 via-[#3b82f6]/10 to-[#05070b]/10 p-3 sm:p-4">
                    <p className="text-xs text-[var(--text-muted)] sm:text-sm">
                      Momentum score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                      94%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon ?? Sparkles;
            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] p-4 shadow-[0_0_30px_rgba(2,8,23,0.35)] transition hover:-translate-y-1 hover:border-[var(--accent)]/30 sm:rounded-3xl sm:p-6"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.accent} opacity-80 transition duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)]"
                    style={{ backgroundColor: "var(--surface-strong)" }}
                  >
                    <Icon size={18} className="text-[var(--foreground)]" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-[var(--foreground)] sm:mt-5 sm:text-xl">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] sm:mt-3 sm:leading-7">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
