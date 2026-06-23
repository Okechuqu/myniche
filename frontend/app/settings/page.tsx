"use client";

import { isAxiosError } from "axios";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import {
  changePassword,
  requestPasswordReset,
} from "@/services/api/auth.api";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

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

  return "Password update failed";
};

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const requiresCurrentPassword = user?.has_usable_password ?? true;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (values: PasswordChangeInput) => {
    if (requiresCurrentPassword && !values.currentPassword?.trim()) {
      setError("currentPassword", {
        type: "manual",
        message: "Current password is required",
      });
      return;
    }

    setPasswordMessage(null);
    setPasswordError(null);
    setIsPasswordSubmitting(true);

    try {
      const response = await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });
      setUser(response.user);
      setPasswordMessage(response.detail);
      reset();
    } catch (error) {
      setPasswordError(getErrorMessage(error));
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const onResetRequest = async () => {
    if (!user?.email) {
      setResetError("Your email address is not available.");
      return;
    }

    setResetMessage(null);
    setResetError(null);
    setResetUrl(null);
    setIsResetSubmitting(true);

    try {
      const response = await requestPasswordReset({
        email: user.email,
      });
      setResetMessage(response.detail);
      setResetUrl(response.reset_url ?? null);
    } catch (error) {
      setResetError(getErrorMessage(error));
    } finally {
      setIsResetSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-slate-400">
          Manage account security and workspace preferences.
        </p>

        <div className="mt-6 space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold">Password</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {requiresCurrentPassword
                    ? "Change your existing account password."
                    : "Add a password so you can sign in with email too."}
                </p>
              </div>
              <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {requiresCurrentPassword ? "Password enabled" : "Social login"}
              </div>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={handleSubmit(onPasswordSubmit)}
            >
              {requiresCurrentPassword && (
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Current password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 focus:border-pink-500"
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    New password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 focus:border-pink-500"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 focus:border-pink-500"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {passwordError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 shadow-sm">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 shadow-sm">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPasswordSubmitting
                  ? "Saving..."
                  : requiresCurrentPassword
                    ? "Update password"
                    : "Set password"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Password reset</h2>
            <p className="mt-2 text-sm text-slate-400">
              Send a reset link to {user?.email ?? "your account email"}.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onResetRequest}
                disabled={isResetSubmitting}
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetSubmitting ? "Sending..." : "Email reset link"}
              </button>

              {resetUrl && (
                <Link
                  href={resetUrl}
                  className="rounded-lg border border-pink-400/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-200 hover:border-pink-300"
                >
                  Open reset link
                </Link>
              )}
            </div>

            {resetError && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 shadow-sm">
                {resetError}
              </div>
            )}

            {resetMessage && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 shadow-sm">
                {resetMessage}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Update username, niche, and creator goal.
                </p>
              </div>
              <Link
                href="/profile"
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center text-sm text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Edit profile
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Subscription</h2>
            <p className="mt-2 text-sm text-slate-400">
              Free, Creator, and Agency plans later.
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
