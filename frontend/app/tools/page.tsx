"use client";

import { ExternalLink } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";

export default function ToolsPage() {
  const tools = [
    {
      name: "CapCut",
      category: "Editing",
      note: "Fast short-form editing and captions.",
    },
    {
      name: "Canva",
      category: "Design",
      note: "Thumbnails, carousels, and brand assets.",
    },
    {
      name: "OBS Studio",
      category: "Recording",
      note: "Screen recording and livestream capture.",
    },
    {
      name: "Notion",
      category: "Planning",
      note: "Content calendar and research workspace.",
    },
    {
      name: "DaVinci Resolve",
      category: "Editing",
      note: "Long-form video editing and color.",
    },
    {
      name: "Photopea",
      category: "Design",
      note: "Browser-based image editing.",
    },
    {
      name: "Ezgif",
      category: "Utility",
      note: "Compress and convert quick media snippets.",
    },
    {
      name: "Audacity",
      category: "Audio",
      note: "Clean voiceovers and podcast audio.",
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">Creator Tools</h1>
        <p className="theme-muted mt-2">
          A practical stack for recording, editing, planning, and publishing.
        </p>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <article
            key={tool.name}
            className="theme-surface rounded-lg border p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--accent)]">
                  {tool.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{tool.name}</h2>
              </div>
              <ExternalLink size={17} className="theme-muted" />
            </div>
            <p className="theme-muted mt-4 text-sm leading-6">
              {tool.note}
            </p>
          </article>
        ))}
      </section>

      <section className="theme-surface mt-6 rounded-lg border p-5">
        <h2 className="font-semibold">Recommended workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Plan in MyNiche", "Record and edit", "Track what works"].map(
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
    </DashboardLayout>
  );
}
