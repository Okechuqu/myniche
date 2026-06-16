import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-sm">
          Creator Operating System
        </div>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          Create Better Content
          <br />
          With Less Effort
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400">
          Generate scripts, organize ideas, plan content calendars, discover
          creator tools and stay consistent.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/demo"
            className="rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-8 py-4 font-semibold"
          >
            Try Free
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-slate-700 px-8 py-4"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
