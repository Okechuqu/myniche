import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-5xl font-bold">Resources</h1>

        <div className="mt-12 space-y-6">
          <div className="rounded-xl border border-slate-800 p-6">
            Beginner Creator Guide
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Script Writing Frameworks
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Content Planning Guide
          </div>

          <div className="rounded-xl border border-slate-800 p-6">
            Free Creator Tools Directory
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
