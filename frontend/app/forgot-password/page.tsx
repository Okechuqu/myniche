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

  return "Password reset request failed";
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
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your account email and we will send a reset link.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 focus:border-pink-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {apiError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 shadow-sm">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 shadow-sm">
                {successMessage}
              </div>
            )}

            {resetUrl && (
              <Link
                href={resetUrl}
                className="block rounded-lg border border-pink-400/30 bg-pink-500/10 p-3 text-sm text-pink-200 hover:border-pink-300"
              >
                Open reset link
              </Link>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Remembered it?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300">
              Back to login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
