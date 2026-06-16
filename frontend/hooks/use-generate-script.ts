import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

export const useGenerateScript = () => {
  return useMutation({
    mutationFn: async (data: {
      niche: string;
      platform: string;
      topic: string;
      tone: string;
    }) => {
      const res = await api.post("/scripts/generate/", data);
      return res.data;
    },
  });
};
