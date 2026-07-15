import api from "./client";

export interface PlannedContentItem {
  id: number;
  day_name: string;
  topic: string;
  status: string;
  script?: string;
  generated_title?: string;
  generated_variant?: string;
}

export interface ContentPlan {
  id: number;
  title: string;
  niche: string;
  platform: string;
  week_start: string;
  created_at: string;
  content_plan?: {
    period?: "weekly" | "monthly";
    period_key?: string;
    auto_generated?: boolean;
  };
  items: PlannedContentItem[];
}

export interface MissingNicheResponse {
  missing_niche: true;
  message: string;
}

export type CurrentPlans =
  | {
      weekly: ContentPlan;
      monthly: ContentPlan;
    }
  | MissingNicheResponse;

export const getCurrentPlans = async () => {
  const response = await api.get<CurrentPlans>("/planner/current/");
  return response.data;
};
