import { RefreshCw, WifiOff } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "You’re offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <section className="theme-surface theme-elevated w-full max-w-lg rounded-3xl border p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)]">
          <WifiOff size={30} />
        </span>
        <h1 className="mt-7 text-3xl font-bold tracking-tight">
          You’re offline
        </h1>
        <p className="theme-muted mx-auto mt-3 max-w-sm leading-7">
          Reconnect to the internet to access your creator workspace and sync
          your latest work.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#1d4ed8] px-5 py-3 font-semibold text-white"
        >
          <RefreshCw size={17} />
          Try again
        </Link>
      </section>
    </main>
  );
}
