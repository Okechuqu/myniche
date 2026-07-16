"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from "@/lib/validations/auth";
import { requestPasswordReset } from "@/services/api/auth.api";

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

  return "We are unable to process your Password reset request at this time. Please try again later.";
};

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: PasswordResetRequestInput) => {
    setApiError(null);
    setSuccessMessage(null);
    setResetUrl(null);
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(values);
      setSuccessMessage(response.detail);
      setResetUrl(response.reset_url ?? null);
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="theme-surface theme-elevated w-full rounded-2xl border p-8">
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="theme-muted mt-2 text-sm">
            Enter your account email and we will send a reset link.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Email
              </label>
              <input
                type="email"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
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

            {resetUrl && (
              <Link
                href={resetUrl}
                className="block rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent)] hover:border-[var(--accent)]"
              >
                Open reset link
              </Link>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="theme-muted mt-6 text-sm">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-[var(--accent)] hover:text-[var(--accent)]"
            >
              Back to login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
