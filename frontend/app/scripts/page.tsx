"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ScriptForm from "@/components/scripts/script-form";

export default function ScriptsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script Generator</h1>
        <p className="mt-2 text-slate-400">
          Start a background AI job and track the result.
        </p>
      </div>

      <ScriptForm />
    </DashboardLayout>
  );
}
