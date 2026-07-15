import Link from "next/link";
import {
  AlertTriangle,
  Construction,
  Mail,
  RefreshCw,
  Wrench,
} from "lucide-react";

export default function ServerErrorPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 sm:px-8">
        <section className="relative w-full overflow-hidden rounded-[2rem] border border-amber-600/30 bg-linear-to-b from-amber-950/20 via-[var(--surface-soft)] to-[var(--surface-soft)] p-8 shadow-[0_40px_100px_-30px_rgba(217,119,6,0.5)] sm:p-12">
          {/* Stripe pattern header */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-amber-600 via-yellow-500 to-amber-700"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-12 h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent"
          />

          {/* Maintenance icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/50 bg-amber-900/30">
            <Construction size={40} className="text-amber-400" />
          </div>

          {/* Badge */}
          <span className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
            <AlertTriangle size={13} />
            Server maintenance
          </span>

          <h1 className="mt-4 text-center text-4xl font-black tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            We&rsquo;ll be back shortly
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Our servers are currently undergoing scheduled maintenance. Your
            work is safely saved, and we expect to be back online within the
            hour.
          </p>

          {/* Status cards */}
          <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
            {[
              {
                label: "Status",
                value: "Maintenance",
                color: "text-amber-400",
              },
              {
                label: "ETA",
                value: "~15 min",
                color: "text-[var(--foreground)]",
              },
              {
                label: "Support",
                value: "team@myniche.com",
                color: "text-[var(--foreground)]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-amber-600/20 bg-[var(--surface)] p-4 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  {item.label}
                </p>
                <p className={`mt-1.5 text-sm font-semibold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:bg-amber-500"
            >
              <RefreshCw size={16} />
              Refresh
            </Link>
            <Link
              href="mailto:team@myniche.com"
              className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-amber-500 hover:bg-amber-900/10"
            >
              <Mail size={16} />
              Contact support
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            <Wrench size={12} className="mr-1 inline" />
            This is temporary. We haven&rsquo;t gone anywhere.
          </p>
        </section>
      </div>
    </main>
  );
}
