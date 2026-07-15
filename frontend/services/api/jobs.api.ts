import api from "./client";

export interface CreateScriptJobPayload {
  niche: string;
  platform: string;
  topic: string;
  tone: string;
  count?: number;
}

export interface JobDetails {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  result: {
    content?: string;
    scripts?: Array<{ content: string }>;
  } | null;
  error: string;
  created_at: string;
}

export const createScriptJob = async (payload: CreateScriptJobPayload) => {
  const response = await api.post("/jobs/scripts/", payload);
  return response.data as {
    job_id: number;
    status: string;
  };
};

export const getJob = async (jobId: number) => {
  const response = await api.get(`/jobs/${jobId}/`);
  return response.data as JobDetails;
};
