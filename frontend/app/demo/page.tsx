"use client";

import PublicNavbar from "@/components/layout/public-navbar";
import { useState } from "react";

export default function DemoPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/demo/generate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            niche,
            platform,
            topic,
            tone,
          }),
        },
      );

      const data = await res.json();

      if (data.script) {
        setResult(data.script);
      } else {
        setResult("Failed to generate script.");
      }
    } catch (err) {
      setResult("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicNavbar />
      <main className="min-h-[calc(100vh-73px)] bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h1 className="text-3xl font-bold">Try MyNiche for free</h1>
            <p className="mt-2 text-slate-400">
              Generate one sample script without creating an account.
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Niche"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />
              <input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Platform"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />
              <input
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="Tone"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium"
              >
                {loading ? "Generating..." : "Generate Free Script"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Output</h2>
            <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
              {result || "Your free script appears here."}
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
              Want to save scripts, view history, and unlock the full workspace?
              Create a free account.
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
