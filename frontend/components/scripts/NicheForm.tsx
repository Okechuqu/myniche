"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Smartphone } from "lucide-react";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import { useQueryClient } from "@tanstack/react-query";
// import { FaYoutube } from "react-icons/fa";

import { useCreateScriptJob } from "@/features/jobs/hooks/use-create-script-job";
import { useJob } from "@/features/jobs/hooks/use-job";

type NicheFormMode = "authenticated" | "demo";

interface NicheFormProps {
  mode?: NicheFormMode;
  title?: string;
  description?: string;
}

const formatOptions = [
  {
    value: "short_form",
    label: "Short-form",
    description: "TikTok, Reels, Shorts",
    platform: "TikTok/Reels",
    Icon: Smartphone,
  },
  {
    value: "long_form",
    label: "Long-form",
    description: "YouTube essay",
    platform: "YouTube",
    Icon: SiYoutube,
  },
] as const;

const getPlatformFromFormat = (format: string) =>
  formatOptions.find((option) => option.value === format)?.platform ??
  "TikTok/Reels";

export default function NicheForm({
  mode = "authenticated",
  title = "AI Script Architect",
  description = "Create a niche-aware script with a few focused inputs.",
}: NicheFormProps) {
  const [formData, setFormData] = useState({
    niche: "",
    format: "short_form",
    tone: "casual",
    topic: "",
  });
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const createJob = useCreateScriptJob();
  const jobQuery = useJob(jobId);

  const selectedPlatform = useMemo(
    () => getPlatformFromFormat(formData.format),
    [formData.format],
  );

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
    setLoading(mode === "demo");
    setGeneratedScript("");
    setError("");
    setJobId(null);

    try {
      const payload = {
        niche: formData.niche,
        platform: selectedPlatform,
        topic: formData.topic,
        tone: formData.tone,
      };

      if (mode === "demo") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/demo/generate/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const message =
            errorBody?.error ||
            errorBody?.detail ||
            `Failed to generate script (${response.status})`;
          throw new Error(message);
        }

        const data = await response.json();
        setGeneratedScript(data.script || "");
        setLoading(false);
        return;
      }

      createJob.mutate(payload, {
        onSuccess: (data) => {
          setJobId(data.job_id);
        },
        onError: (mutationError) => {
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : "Failed to start the script job.",
          );
          setLoading(false);
        },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = jobQuery.data?.status;

    if (status === "completed") {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-summary"] });
    }
  }, [jobQuery.data?.status, queryClient]);

  const jobStatus = jobId ? (jobQuery.data?.status ?? "pending") : "";
  const isJobRunning =
    createJob.isPending ||
    Boolean(jobId && jobStatus !== "completed" && jobStatus !== "failed");
  const isSubmitting = mode === "demo" ? loading : isJobRunning;
  const jobError =
    jobStatus === "failed"
      ? jobQuery.data?.error || "Script generation failed."
      : "";
  const outputScript =
    generatedScript ||
    (jobStatus === "completed" ? (jobQuery.data?.result?.content ?? "") : "");

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-pink-300">
          <FileText size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Creator niche
            </label>
            <input
              type="text"
              name="niche"
              placeholder="Tech tutorials, personal finance"
              value={formData.niche}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tone"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Script tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-pink-500"
            >
              <option value="casual">Casual and friendly</option>
              <option value="authoritative">Authoritative and expert</option>
              <option value="high_energy">High energy</option>
              <option value="storytelling">Cinematic storytelling</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Content format
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {formatOptions.map(({ value, label, description: copy, Icon }) => {
              const active = formData.format === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, format: value })}
                  className={`flex min-h-20 items-center gap-3 rounded-lg border p-4 text-left transition ${
                    active
                      ? "border-pink-400 bg-pink-500/10 text-white"
                      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {copy}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            What is the video about?
          </label>
          <textarea
            name="topic"
            rows={5}
            placeholder="3 hidden VS Code extensions that speed up coding"
            value={formData.topic}
            onChange={handleChange}
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-pink-500"
            required
          />
        </div>

        {(error || jobError) && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error || jobError}
          </div>
        )}

        {jobStatus && jobStatus !== "completed" && jobStatus !== "failed" && (
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
            Job status: {jobStatus}.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 px-6 py-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting
            ? "Architecting script..."
            : "Generate strategic script"}
        </button>
      </form>

      {outputScript && (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950 p-5 text-sm leading-6 text-slate-200">
          <h3 className="mb-4 text-lg font-bold text-white">
            Your generated script
          </h3>
          <pre className="whitespace-pre-wrap font-mono">{outputScript}</pre>
        </div>
      )}
    </div>
  );
}
