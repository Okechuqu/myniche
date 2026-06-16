"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import PlannerBoard from "@/components/planner/planner-board";

export default function PlannerPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Weekly Planner</h1>
      <p className="mt-2 text-slate-400">
        Keep the content plan visible and simple.
      </p>

      <div className="mt-6">
        <PlannerBoard />
      </div>
    </DashboardLayout>
  );
}
