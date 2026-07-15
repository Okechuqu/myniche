"use client";

import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Save, UserRound } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
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

  return "Profile update failed";
};

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const niche = String(formData.get("niche") ?? "").trim();
    const mainPlatform = String(formData.get("main_platform") ?? "").trim();
    const creatorGoal = String(formData.get("creator_goal") ?? "").trim();
    const avatar = String(formData.get("avatar") ?? "").trim();

    if (!username) {
      setError("Username is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await updateProfile({
        username,
        niche,
        main_platform: mainPlatform,
        creator_goal: creatorGoal,
        avatar,
      });
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["planner-current"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-summary"] });
      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "M";

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Update Profile</h1>
          <p className="theme-muted mt-2">
            Keep your creator identity and personalization details current.
          </p>
        </div>

        <section className="theme-surface mt-6 rounded-lg border p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="theme-surface-soft flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <div className="theme-muted flex items-center gap-2 text-sm">
                <UserRound size={16} />
                {user?.email ?? "Signed-in account"}
              </div>
              <p className="theme-muted mt-2 text-sm leading-6">
                Your niche and goal help MyNiche tailor scripts, planner ideas,
                and dashboard context.
              </p>
            </div>
          </div>

          <form
            key={[
              user?.id ?? "profile-loading",
              user?.niche ?? "",
              user?.main_platform ?? "",
              user?.creator_goal ?? "",
              user?.avatar ?? "",
            ].join(":")}
            className="mt-6 space-y-4"
            onSubmit={onSubmit}
          >
            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Username
              </label>
              <input
                name="username"
                defaultValue={user?.username ?? ""}
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Creator niche
              </label>
              <input
                name="niche"
                defaultValue={user?.niche ?? ""}
                placeholder="Personal finance, fitness, SaaS tutorials"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Main platform
              </label>
              <input
                name="main_platform"
                defaultValue={user?.main_platform ?? ""}
                placeholder="TikTok, YouTube, Instagram, LinkedIn"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Creator goal
              </label>
              <textarea
                name="creator_goal"
                defaultValue={user?.creator_goal ?? ""}
                rows={4}
                placeholder="Grow a consistent content engine around one clear topic."
                className="theme-input w-full resize-y rounded-lg border px-4 py-3 outline-none ring-0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Avatar URL
              </label>
              <input
                name="avatar"
                defaultValue={user?.avatar ?? ""}
                placeholder="https://example.com/avatar.png"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {isSubmitting ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
