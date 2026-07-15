"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useMe } from "@/features/auth/hooks/use-me";

export const useAuthGuard = () => {
  const router = useRouter();
  const access = useAuthStore((state) => state.access);
  const isHydrated = useAuthStore((state) => state.hasHydrated);
  const { isError } = useMe(true);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!access) {
      router.replace("/login");
    }
  }, [access, isHydrated, router]);

  useEffect(() => {
    if (isError && !access) {
      router.replace("/login");
    }
  }, [access, isError, router]);
};
