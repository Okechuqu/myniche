"use client";

import { useState } from "react";

export default function NicheForm() {
  const [formData, setFormData] = useState({
    niche: "",
    format: "short_form", // Default value
    tone: "casual",
    topic: "",
  });
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedScript("");

    try {
      // This will eventually point to your Python backend API endpoint
      const response = await fetch(
        "http://localhost:8000/api/generate-script",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          errorBody?.error || `Failed to generate script (${response.status})`;
        throw new Error(message);
      }

      const data = await response.json();
      setGeneratedScript(data.script || "");
    } catch (error) {
      console.error("Error:", error);
      setGeneratedScript("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        AI Script Architect
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Niche & Tone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Creator Niche
            </label>
            <input
              type="text"
              name="niche"
              placeholder="e.g., Tech Tutorials, Personal Finance"
              value={formData.niche}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium mb-2 text-slate-300"
            >
              Script Tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="casual">Casual & Friendly</option>
              <option value="authoritative">Authoritative & Expert</option>
              <option value="high_energy">High Energy & Hype</option>
              <option value="storytelling">Cinematic Storytelling</option>
            </select>
          </div>
        </div>

        {/* Format Selection (The Critical Fork) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Content Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, format: "short_form" })}
              className={`p-4 rounded-lg border text-center font-medium transition ${
                formData.format === "short_form"
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750"
              }`}
            >
              📱 Short-Form (TikTok/Reels)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, format: "long_form" })}
              className={`p-4 rounded-lg border text-center font-medium transition ${
                formData.format === "long_form"
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750"
              }`}
            >
              📺 Long-Form (YouTube Essay)
            </button>
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            What is the video about?
          </label>
          <textarea
            name="topic"
            rows={4}
            placeholder="e.g., 3 hidden VS Code extensions that speed up coding by 200%..."
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition raw-text"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50 transition"
        >
          {loading ? "Architecting Script..." : "Generate Strategic Script"}
        </button>
      </form>

      {/* Script Output Window */}
      {generatedScript && (
        <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-lg whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200">
          <h3 className="text-lg font-bold mb-4 text-purple-400 font-sans">
            Your Generated Script:
          </h3>
          {generatedScript}
        </div>
      )}
    </div>
  );
}
