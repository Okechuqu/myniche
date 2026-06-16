"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-slate-400">
        Manage profile, plan, and future AI provider keys.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-400">
            Update username, niche, and creator goal.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">Subscription</h2>
          <p className="mt-2 text-sm text-slate-400">
            Free, Creator, and Agency plans later.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">AI Provider</h2>
          <p className="mt-2 text-sm text-slate-400">
            Gemini now, OpenAI later with the same service layer.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
