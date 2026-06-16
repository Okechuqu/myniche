import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-center text-5xl font-bold">Pricing</h1>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 p-8">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="mt-4">₦0/month</p>
          </div>

          <div className="rounded-2xl border border-pink-500 p-8">
            <h2 className="text-2xl font-bold">Creator</h2>
            <p className="mt-4">Coming Soon</p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-8">
            <h2 className="text-2xl font-bold">Agency</h2>
            <p className="mt-4">Coming Soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
