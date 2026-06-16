"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { scriptSchema, type ScriptInput } from "@/lib/validations/script";
import { useCreateScriptJob } from "@/features/jobs/hooks/use-create-script-job";
import { useJob } from "@/features/jobs/hooks/use-job";

export default function ScriptForm() {
  const [jobId, setJobId] = useState<number | null>(null);

  const createJob = useCreateScriptJob();
  const jobQuery = useJob(jobId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScriptInput>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      niche: "",
      platform: "",
      topic: "",
      tone: "",
    },
  });

  const onSubmit = (values: ScriptInput) => {
    createJob.mutate(values, {
      onSuccess: (data) => {
        setJobId(data.job_id);
        reset(values);
      },
    });
  };

  const result = jobQuery.data?.result?.content ?? "";

  useEffect(() => {
    if (jobQuery.data?.status === "completed") {
      setJobId(null);
    }
  }, [jobQuery.data?.status]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Generate script</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create a niche-aware script with a few inputs.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Niche</label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
              {...register("niche")}
            />
            {errors.niche && (
              <p className="mt-1 text-xs text-red-400">
                {errors.niche.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Platform
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
              {...register("platform")}
            />
            {errors.platform && (
              <p className="mt-1 text-xs text-red-400">
                {errors.platform.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Topic</label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="mt-1 text-xs text-red-400">
                {errors.topic.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Tone</label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
              {...register("tone")}
            />
            {errors.tone && (
              <p className="mt-1 text-xs text-red-400">{errors.tone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={createJob.isPending}
            className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium"
          >
            {createJob.isPending ? "Starting job..." : "Generate script"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Output</h2>

        {!jobId && !createJob.data && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
            Generated script appears here after the job starts.
          </div>
        )}

        {jobId && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              Job status, {jobQuery.data?.status ?? "pending"}.
            </div>

            {jobQuery.data?.status === "processing" && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                The AI worker is writing the script.
              </div>
            )}

            {jobQuery.data?.status === "failed" && (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                {jobQuery.data.error_message || "Job failed"}
              </div>
            )}

            {jobQuery.data?.status === "completed" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Generated script
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                    {result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
