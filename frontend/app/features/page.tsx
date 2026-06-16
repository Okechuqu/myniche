import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-5xl font-bold">Features</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 p-6">
            AI Script Generator
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Content Planner
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Content Calendar
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Creator Toolkit
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Analytics
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Team Collaboration
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
