"use client";

import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { updateProfile } from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      return Object.entries(data)
        .map(([key, value]) =>
          Array.isArray(value)
            ? `${key}: ${value.join(", ")}`
            : `${key}: ${String(value)}`,
        )
        .join(" \n");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save onboarding details.";
};

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/login");
    }
  }, [hasHydrated, router, user]);

  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      router.replace("/login");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const trimmedNiche = String(formData.get("niche") ?? "").trim();
    const platform = String(formData.get("main_platform") ?? "").trim();
    const goal = String(formData.get("creator_goal") ?? "").trim();

    if (!trimmedNiche) {
      setError("Add your creator niche so MyNiche can tailor your planner.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const updatedUser = await updateProfile({
        username: user.username,
        niche: trimmedNiche,
        main_platform: platform,
        creator_goal: goal,
      });

      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["planner-current"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-summary"] });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg items-center">
        <div className="theme-surface theme-elevated w-full rounded-2xl border p-8">
          <h1 className="text-3xl font-bold">Set up your creator profile</h1>
          <p className="theme-muted mt-2 text-sm">
            Give MyNiche a few details, then the workspace tailors itself.
          </p>

          <form
            key={[
              user?.id ?? "onboarding-loading",
              user?.niche ?? "",
              user?.main_platform ?? "",
              user?.creator_goal ?? "",
            ].join(":")}
            className="mt-8 space-y-4"
            onSubmit={handleContinue}
          >
            <input
              name="niche"
              placeholder="Your niche"
              defaultValue={user?.niche ?? ""}
              className="theme-input w-full rounded-lg border px-4 py-3 outline-none"
            />

            <input
              name="main_platform"
              placeholder="Main platform"
              defaultValue={user?.main_platform ?? ""}
              className="theme-input w-full rounded-lg border px-4 py-3 outline-none"
            />

            <input
              name="creator_goal"
              placeholder="Creator goal"
              defaultValue={user?.creator_goal ?? ""}
              className="theme-input w-full rounded-lg border px-4 py-3 outline-none"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
