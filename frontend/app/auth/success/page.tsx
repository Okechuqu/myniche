"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";

function AuthSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access) {
      setTokens(access, refresh ?? "");
      router.replace("/");
    } else {
      // If no tokens, go to login
      router.replace("/login");
    }
  }, [params, router]);

  return null;
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={null}>
      <AuthSuccessContent />
    </Suspense>
  );
}
