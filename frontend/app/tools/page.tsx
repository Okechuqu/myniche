"use client";

import { ExternalLink } from "lucide-react";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

export default function ToolsPage() {
  const tools = [
    {
      name: "CapCut",
      href: "https://www.capcut.com/",
      category: "Editing",
      note: "Fast short-form editing and captions.",
    },
    {
      name: "Canva",
      href: "https://www.canva.com/",
      category: "Design",
      note: "Thumbnails, carousels, and brand assets.",
    },
    {
      name: "OBS Studio",
      href: "https://obsproject.com/",
      category: "Recording",
      note: "Screen recording and livestream capture.",
    },
    {
      name: "Notion",
      href: "https://www.notion.so/",
      category: "Planning",
      note: "Content calendar and research workspace.",
    },
    {
      name: "DaVinci Resolve",
      href: "https://www.blackmagicdesign.com/products/davinciresolve",
      category: "Editing",
      note: "Long-form video editing and color.",
    },
    {
      name: "Photopea",
      href: "https://www.photopea.com/",
      category: "Design",
      note: "Browser-based image editing.",
    },
    {
      name: "Ezgif",
      href: "https://ezgif.com/",
      category: "Utility",
      note: "Compress and convert quick media snippets.",
    },
    {
      name: "Audacity",
      href: "https://www.audacityteam.org/",
      category: "Audio",
      note: "Clean voiceovers and podcast audio.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">Creator Tools</h1>
          <p className="theme-muted mt-3 max-w-2xl">
            A practical stack for recording, editing, planning, and publishing.
          </p>
        </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-surface group rounded-lg border p-5 transition hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--accent)]">
                  {tool.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{tool.name}</h2>
              </div>
              <ExternalLink
                size={17}
                className="theme-muted transition group-hover:text-[var(--accent)]"
              />
            </div>
            <p className="theme-muted mt-4 text-sm leading-6">
              {tool.note}
            </p>
          </a>
        ))}
      </section>

      <section className="theme-surface mt-6 rounded-lg border p-5">
        <h2 className="font-semibold">Recommended workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Plan in ReelsDraft", "Record and edit", "Track what works"].map(
            (step) => (
              <div
                key={step}
                className="theme-surface-soft rounded-lg border p-4 text-sm"
              >
                {step}
              </div>
            ),
          )}
        </div>
      </section>
      </div>
      <Footer />
    </main>
  );
}
