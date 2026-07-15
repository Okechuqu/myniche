"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ScriptForm from "@/components/scripts/script-form";

export default function ScriptsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Script Generator</h1>
        <p className="theme-muted mt-2">
          Generate niche-aware scripts and keep the finished work in history.
        </p>
      </div>

      <ScriptForm />
    </DashboardLayout>
  );
}
