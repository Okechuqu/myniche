"use client";

import { useQuery } from "@tanstack/react-query";
import { listScripts } from "@/services/api/scripts.api";

export const useScripts = () => {
  return useQuery({
    queryKey: ["scripts"],
    queryFn: listScripts,
  });
};
