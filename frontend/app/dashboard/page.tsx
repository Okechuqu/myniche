"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import AnalyticsCards from "@/components/dashboard/analytics-cards";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back{user?.username ? `, ${user.username}` : ""}
        </h1>
        <p className="text-slate-400">Your creator system overview.</p>
      </div>

      <AnalyticsCards />
    </DashboardLayout>
  );
}
