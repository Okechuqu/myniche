"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import MyNicheEmptyState from "@/components/shared/myniche-empty-state";
import { useScripts } from "@/features/scripts/hooks/use-scripts";

export default function ScriptHistoryPage() {
  const { data, isLoading, isError } = useScripts();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script History</h1>
        <p className="mt-2 text-slate-400">Saved scripts from earlier jobs.</p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          Loading scripts...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-red-300">
          Failed to load scripts.
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <MyNicheEmptyState
          description="Generated scripts will appear here once you create and save your first piece."
        />
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((script) => (
            <div
              key={script.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5"
            >
              <h2 className="text-lg font-semibold">{script.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {script.niche} , {script.platform}
              </p>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-200">
                {script.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
