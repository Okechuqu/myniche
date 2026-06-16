"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

type MeResult = Awaited<ReturnType<typeof me>>;

export const useMe = (enabled = true) => {
  const access = useAuthStore((state) => state.access);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const query = useQuery<MeResult, Error>({
    queryKey: ["me"],
    queryFn: async () => await me(),
    enabled: enabled && Boolean(access),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.isError) {
      clearSession();
    }
  }, [clearSession, query.isError]);

  return query;
};
