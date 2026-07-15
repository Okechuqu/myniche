"use client";

import { isAxiosError } from "axios";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import {
  changePassword,
  deleteAccount,
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
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { clearTokens } from "@/lib/auth";

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
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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

  const onDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setDeleteError("Type DELETE to confirm account deletion.");
      return;
    }

    const confirmed = window.confirm(
      "Delete your MyNiche account and all related workspace data? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeleteError(null);
    setIsDeletingAccount(true);

    try {
      await deleteAccount();
      clearTokens();
      router.replace("/");
    } catch (error) {
      setDeleteError(getErrorMessage(error));
      setIsDeletingAccount(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="theme-muted mt-2">
          Manage account security and workspace preferences.
        </p>

        <div className="mt-6 space-y-4">
          <section className="theme-surface rounded-xl border p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold">Password</h2>
                <p className="theme-muted mt-2 text-sm">
                  {requiresCurrentPassword
                    ? "Change your existing account password."
                    : "Add a password so you can sign in with email too."}
                </p>
              </div>
              <div className="theme-subtle rounded-full border px-3 py-1 text-xs">
                {requiresCurrentPassword ? "Password enabled" : "Social login"}
              </div>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={handleSubmit(onPasswordSubmit)}
            >
              {requiresCurrentPassword && (
                <div>
                  <label className="mb-2 block text-sm text-[var(--foreground)]">
                    Current password
                  </label>
                  <input
                    type="password"
                    className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
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
                  <label className="mb-2 block text-sm text-[var(--foreground)]">
                    New password
                  </label>
                  <input
                    type="password"
                    className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[var(--foreground)]">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
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
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 shadow-sm">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 shadow-sm">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPasswordSubmitting
                  ? "Saving..."
                  : requiresCurrentPassword
                    ? "Update password"
                    : "Set password"}
              </button>
            </form>
          </section>

          <section className="theme-surface rounded-xl border p-5">
            <h2 className="font-semibold">Password reset</h2>
            <p className="theme-muted mt-2 text-sm">
              Send a reset link to {user?.email ?? "your account email"}.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onResetRequest}
                disabled={isResetSubmitting}
                className="theme-action-secondary rounded-lg border px-4 py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetSubmitting ? "Sending..." : "Email reset link"}
              </button>

              {resetUrl && (
                <Link
                  href={resetUrl}
                  className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  Open reset link
                </Link>
              )}
            </div>

            {resetError && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 shadow-sm">
                {resetError}
              </div>
            )}

            {resetMessage && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 shadow-sm">
                {resetMessage}
              </div>
            )}
          </section>

          <section className="theme-surface rounded-xl border p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="theme-muted mt-2 text-sm">
                  Update username, niche, and creator goal.
                </p>
              </div>
              <Link
                href="/profile"
                className="theme-action-secondary rounded-lg border px-4 py-3 text-center text-sm transition"
              >
                Edit profile
              </Link>
            </div>
          </section>

          <section className="theme-surface rounded-xl border p-5">
            <h2 className="font-semibold">Subscription</h2>
            <p className="theme-muted mt-2 text-sm">
              Free, Creator, and Agency plans later.
            </p>
          </section>

          <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold text-red-500">Delete account</h2>
                <p className="mt-2 text-sm text-red-500/80">
                  Permanently remove your account, scripts, planner data, and
                  workspace history.
                </p>
              </div>
              <Trash2 size={20} className="hidden text-red-500 sm:block" />
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-red-500">
                Type DELETE to confirm
              </label>
              <input
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                disabled={isDeletingAccount}
              />

              {deleteError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                  {deleteError}
                </div>
              )}

              <button
                type="button"
                onClick={onDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || isDeletingAccount}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingAccount ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {isDeletingAccount ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
