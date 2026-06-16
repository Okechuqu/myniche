import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function ToolsPage() {
  const tools = [
    "CapCut",
    "Canva",
    "OBS Studio",
    "Notion",
    "DaVinci Resolve",
    "Photopea",
    "Ezgif",
    "Audacity",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-5xl font-bold">Creator Tools</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {tools.map((tool) => (
            <div key={tool} className="rounded-xl border border-slate-800 p-6">
              {tool}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
