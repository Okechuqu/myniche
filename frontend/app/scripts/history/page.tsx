"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import MyNicheEmptyState from "@/components/shared/myniche-empty-state";
import { useScripts } from "@/features/scripts/hooks/use-scripts";
import { deleteScript } from "@/services/api/scripts.api";

export default function ScriptHistoryPage() {
  const { data, isLoading, isError } = useScripts();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteScriptMutation = useMutation({
    mutationFn: deleteScript,
    onMutate: () => {
      setDeleteError("");
    },
    onSuccess: (_, scriptId) => {
      if (expandedId === scriptId) {
        setExpandedId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-summary"] });
    },
    onError: () => {
      setDeleteError("Unable to delete that script. Please try again.");
    },
  });

  const deletingScriptId = deleteScriptMutation.isPending
    ? deleteScriptMutation.variables
    : null;

  const handleDeleteScript = (scriptId: number, title: string) => {
    const confirmed = window.confirm(
      `Delete "${title}" from your script history? This cannot be undone.`,
    );

    if (!confirmed) return;

    deleteScriptMutation.mutate(scriptId);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script History</h1>
        <p className="theme-muted mt-2">Saved scripts from earlier jobs.</p>
      </div>

      {isLoading && (
        <div className="theme-surface rounded-xl border p-6">
          Loading scripts...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-500">
          Failed to load scripts.
        </div>
      )}

      {deleteError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
          {deleteError}
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <MyNicheEmptyState description="Generated scripts will appear here once you create and save your first piece." />
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((script) => {
            const isExpanded = expandedId === script.id;

            return (
              <div
                key={script.id}
                className="theme-surface overflow-hidden rounded-lg border"
              >
                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : script.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-[var(--foreground)]">
                        {script.title}
                      </h2>
                      <p className="theme-muted mt-1 text-sm">
                        {script.niche} · {script.platform}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : script.id)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
                    >
                      {isExpanded ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScript(script.id, script.title)}
                      disabled={deletingScriptId === script.id}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition hover:border-red-500/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${script.title}`}
                    >
                      {deletingScriptId === script.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="theme-surface-soft border-t border-[var(--border)] px-5 py-4 text-sm leading-6">
                    <p className="theme-muted mb-3 text-xs uppercase tracking-[0.2em]">
                      {new Date(script.created_at).toLocaleString()}
                    </p>
                    <pre className="whitespace-pre-wrap font-mono">
                      {script.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
