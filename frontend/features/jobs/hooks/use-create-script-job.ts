"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createScriptJob,
  type CreateScriptJobPayload,
} from "@/services/api/jobs.api";

export const useCreateScriptJob = () => {
  return useMutation({
    mutationFn: (payload: CreateScriptJobPayload) => createScriptJob(payload),
  });
};
