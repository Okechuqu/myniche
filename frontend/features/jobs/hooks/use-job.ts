"use client";

import { useQuery } from "@tanstack/react-query";
import { getJob } from "@/services/api/jobs.api";

export const useJob = (jobId?: number | null) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId as number),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "completed") return false;
      if (status === "failed") return false;

      return 3000;
    },
  });
};
