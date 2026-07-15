"use client";

import { useQuery } from "@tanstack/react-query";
import { getJob, type JobDetails } from "@/services/api/jobs.api";

const JOB_POLL_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useJob = (jobId?: number | null) => {
  return useQuery<JobDetails>({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId as number),
    enabled: Boolean(jobId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "completed" || status === "failed") return false;

      const createdAt = query.state.data?.created_at;
      if (createdAt) {
        const elapsed = Date.now() - new Date(createdAt).getTime();
        if (elapsed > JOB_POLL_TIMEOUT) return false;
      }

      return 3000;
    },
  });
};
