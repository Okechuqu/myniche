import Link from "next/link";

export default function PricingPreview() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">Simple Pricing</h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 p-8">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="mt-4 text-slate-400">Limited scripts and planning.</p>
          </div>

          <div className="rounded-2xl border border-pink-500 p-8">
            <h3 className="text-xl font-bold">Creator</h3>
            <p className="mt-4 text-slate-400">
              Unlimited scripts and planner.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-8">
            <h3 className="text-xl font-bold">Agency</h3>
            <p className="mt-4 text-slate-400">
              Team collaboration and analytics.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="rounded-xl bg-white px-8 py-4 text-black"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
