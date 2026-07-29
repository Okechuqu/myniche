"use client";

import { isAxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CalendarDays,
  Home,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import GoogleButton from "@/components/auth/google-button";

const getErrorMessage = (error: unknown) => {
  if (!error) return "Login failed";

  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") {
      // Avoid rendering raw HTML error pages returned by the backend
      if (data.trim().startsWith("<")) {
        return `Please wait while we fix this(${error.response.status}), you can mail us to get faster support.`;
      }
      return data;
    }
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
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[var(--accent-secondary)]/10 blur-3xl"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <section className="hidden min-h-screen flex-col justify-between px-10 py-10 lg:flex xl:px-16 xl:py-12">
          <Link
            href="/"
            className="theme-muted mb-7 inline-flex items-center gap-2 text-sm transition hover:text-[var(--foreground)] lg:mb-9"
          >
            <Home size={16} />
            ReelsDraft
          </Link>

          <div className="max-w-2xl py-12">
            <h2 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Turn your ideas into content that{" "}
              <span className="bg-linear-to-r from-[#d4af37] to-[#60a5fa] bg-clip-text text-transparent">
                gets noticed.
              </span>
            </h2>
            <p className="theme-muted mt-6 max-w-lg text-lg leading-8">
              Plan, write, and organize scroll-stopping content without losing
              your creative momentum.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              <div className="theme-surface-soft rounded-2xl border p-5">
                <Sparkles className="mb-5 text-[var(--accent)]" size={22} />
                <p className="font-semibold">Create faster</p>
                <p className="theme-muted mt-1 text-sm leading-6">
                  Go from a rough idea to a polished script in minutes.
                </p>
              </div>
              <div className="theme-surface-soft rounded-2xl border p-5">
                <CalendarDays
                  className="mb-5 text-[var(--accent-secondary)]"
                  size={22}
                />
                <p className="font-semibold">Stay consistent</p>
                <p className="theme-muted mt-1 text-sm leading-6">
                  Keep every idea and publishing plan in one clear workspace.
                </p>
              </div>
            </div>
          </div>

          <p className="theme-muted text-sm">
            © {new Date().getFullYear()} ReelsDraft. Built for creators.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 sm:py-10 lg:border-l lg:border-[var(--border)] lg:bg-[var(--surface-soft)]/25 lg:px-10 xl:px-16">
          <div className="theme-surface theme-elevated w-full max-w-[520px] rounded-2xl border p-6 sm:rounded-3xl sm:p-9 xl:p-11">
            <Link
              href="/"
              className="theme-muted mb-7 inline-flex items-center gap-2 text-sm transition hover:text-[var(--foreground)] lg:mb-9"
            >
              <Home size={16} />
              ReelsDraft
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>
            <p className="theme-muted mt-3 text-sm leading-6 sm:text-base">
              Sign in to continue creating with ReelsDraft.
            </p>

            <div className="mt-7 space-y-3 sm:mt-8">
              <GoogleButton />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
              <div className="theme-muted relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-3">
                  or sign in with email
                </span>
              </div>
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="theme-input w-full rounded-xl border px-4 py-3.5 outline-none transition focus:ring-3 focus:ring-[var(--accent-secondary-soft)]"
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
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
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="theme-input w-full rounded-xl border px-4 py-3.5 outline-none transition focus:ring-3 focus:ring-[var(--accent-secondary-soft)]"
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
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#1d4ed8] px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:-translate-y-0.5 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isPending ? "Logging in..." : "Login"}
                {!isPending && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="theme-muted mt-7 text-center text-sm">
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
        </section>
      </div>
    </main>
  );
}
