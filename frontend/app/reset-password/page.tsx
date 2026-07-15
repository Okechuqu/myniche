"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordResetConfirmSchema,
  type PasswordResetConfirmInput,
} from "@/lib/validations/auth";
import { confirmPasswordReset } from "@/services/api/auth.api";

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

  return "Password reset failed";
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordResetConfirmInput>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const hasToken = Boolean(uid && token);

  const onSubmit = async (values: PasswordResetConfirmInput) => {
    if (!hasToken) {
      setApiError("Reset link is invalid or expired");
      return;
    }

    setApiError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await confirmPasswordReset({
        uid,
        token,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });
      setSuccessMessage(response.detail);
      reset();
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!hasToken && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 shadow-sm">
          Reset link is invalid or expired.
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]">
            New password
          </label>
          <input
            type="password"
            className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
            disabled={!hasToken || Boolean(successMessage)}
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
            disabled={!hasToken || Boolean(successMessage)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 shadow-sm">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 shadow-sm">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!hasToken || Boolean(successMessage) || isSubmitting}
          className="w-full rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>
      </form>

      <p className="theme-muted mt-6 text-sm">
        Ready to continue?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent)]">
          Back to login
        </Link>
        .
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="theme-surface theme-elevated w-full rounded-2xl border p-8">
          <h1 className="text-3xl font-bold">Choose a new password</h1>
          <p className="theme-muted mt-2 text-sm">
            Use a password that is hard to guess and unique to MyNiche.
          </p>

          <Suspense
            fallback={
              <div className="theme-surface-soft mt-8 rounded-lg border p-3 text-sm">
                Loading reset link...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
