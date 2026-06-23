import api from "./client";

export interface AnalyticsSummary {
  totals: {
    scripts: number;
    weekly_scripts: number;
    monthly_scripts: number;
    planned_items: number;
    completed_items: number;
    consistency_score: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  planner_status: Record<string, number>;
  recent_scripts: Array<{
    id: number;
    title: string;
    platform: string;
    created_at: string;
  }>;
}

export const getAnalyticsSummary = async () => {
  const response = await api.get<AnalyticsSummary>("/analytics/summary/");
  return response.data;
};
