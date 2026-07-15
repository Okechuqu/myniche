"use client";

import { isAxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FacebookButton from "@/components/auth/facebook-button";
import GoogleButton from "@/components/auth/google-button";

const getErrorMessage = (error: unknown) => {
  if (!error) return "Login failed";

  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      return Object.entries(data)
        .map(([key, value]) =>
          Array.isArray(value)
            ? `${key}: ${value.join(", ")}`
            : `${key}: ${value}`,
        )
        .join(" \n");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Login failed";
};

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate, isPending } = useLogin({
    onSuccess: () => {
      setSuccessMessage("Welcome back! Redirecting you to your dashboard.");
      window.setTimeout(() => {
        router.replace("/");
      }, 500);
    },
    onError: (error) => {
      setApiError(getErrorMessage(error));
      window.setTimeout(() => {
        setApiError(null);
      }, 5000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    setApiError(null);
    setSuccessMessage(null);
    mutate(values);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="theme-surface theme-elevated w-full rounded-2xl border p-8">
          <Link
            href="/"
            className="theme-muted mb-6 inline-flex items-center gap-2 text-sm transition hover:text-[var(--foreground)]"
          >
            <Home size={16} />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold">Login to MyNiche</h1>
          <p className="theme-muted mt-2 text-sm">
            Continue with your creator workspace.
          </p>

          <div className="mt-8 space-y-3">
            <GoogleButton />
            <FacebookButton />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
            <div className="theme-muted relative flex justify-center text-xs">
              <span className="bg-[var(--surface)] px-3">
                or sign in with email
              </span>
            </div>
          </div>

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

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm text-[var(--foreground)]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
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
              disabled={isPending}
              className="w-full rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="theme-muted mt-6 text-sm">
            No account yet,{" "}
            <Link
              href="/register"
              className="text-[var(--accent)] hover:text-[var(--accent)]"
            >
              create one
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
