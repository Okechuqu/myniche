import Link from "next/link";
import { ArrowRight, Compass, Cpu, Orbit, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute inset-x-4 top-8 h-40 rounded-full bg-linear-to-r from-[#d4af37]/20 via-[#3b82f6]/20 to-[#05070b]/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] shadow-[0_30px_120px_-55px_rgba(212,175,55,0.7)] backdrop-blur-xl">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10 xl:p-12">
              <div className="flex flex-col justify-between rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    <Orbit size={14} />
                    Signal lost
                  </div>

                  <div className="mt-6 text-7xl font-black tracking-[-0.05em] text-[var(--foreground)] sm:text-8xl lg:text-9xl">
                    404
                  </div>

                  <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                    The page you were trying to reach has drifted out of orbit.
                    You can return home or jump into the creator workspace from
                    here.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    <Compass size={16} />
                    Return home
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
                  >
                    <Sparkles size={16} />
                    Explore features
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  <Cpu size={14} />
                  System status
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Navigation core", value: "Recalibrating" },
                    { label: "Creator engine", value: "Online" },
                    { label: "Planner sync", value: "Stable" },
                    { label: "Script queue", value: "Ready" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[var(--border)] bg-linear-to-br from-[#d4af37]/12 via-[var(--surface-soft)] to-[#3b82f6]/12 p-4 sm:p-5">
                  <div className="flex items-center justify-between text-sm font-medium text-[var(--foreground)]">
                    <span>Transmission route</span>
                    <span className="text-[var(--accent)]">Recovered</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div className="h-full w-[72%] rounded-full bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b]" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <ArrowRight size={15} className="text-[var(--accent)]" />
                    Redirecting you back to a live path.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
