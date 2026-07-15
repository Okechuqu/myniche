"use client";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks/use-login";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FacebookButton from "@/components/auth/facebook-button";
import GoogleButton from "@/components/auth/google-button";
import PrivacyCheckbox from "./PrivacyCheckbox";

const getErrorMessage = (error: unknown) => {
  if (!error) return null;

  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;

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

  if (error instanceof Error) return error.message;

  return "Registration failed";
};

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate, isPending, error } = useRegister({
    redirectOnSuccess: false,
    onSuccess: () => {
      setSuccessMessage("Account created successfully! Redirecting...");
      window.setTimeout(() => {
        router.replace("/onboarding");
      }, 2000);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const passwordsMismatch =
    confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;
  const [privacyChecked, setPrivacyChecked] = useState(false);

  useEffect(() => {
    const errorMessage = getErrorMessage(error);
    if (!errorMessage) {
      return;
    }

    setApiError(errorMessage);
    const timer = window.setTimeout(() => {
      setApiError(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const onSubmit = (values: RegisterInput) => {
    if (!privacyChecked) {
      setApiError("You must agree to the privacy policy before registering.");
      return;
    }

    setApiError(null);
    mutate({
      email: values.email,
      username: values.username,
      password: values.password,
      agreed_to_privacy: privacyChecked,
    });
  };

  const registerErrorMessage = apiError;

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
          <h1 className="text-3xl font-bold">Create MyNiche account</h1>
          <p className="theme-muted mt-2 text-sm">
            Set up your creator workspace in minutes.
          </p>

          <div className="mt-8 space-y-3">
            <GoogleButton />
            <FacebookButton />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
            <div className="theme-muted relative flex justify-center text-xs">
              <span className="bg-[var(--surface)] px-3">
                or create your account manually
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
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Username
              </label>
              <input
                type="text"
                className="theme-input w-full rounded-lg border px-4 py-3 outline-none ring-0"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Password
              </label>
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

            {passwordValue.length > 0 && (
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
                {passwordsMismatch && !errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    Passwords do not match.
                  </p>
                )}
              </div>
            )}

            <PrivacyCheckbox
              checked={privacyChecked}
              onChange={setPrivacyChecked}
            />

            {registerErrorMessage && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 shadow-sm">
                {registerErrorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 shadow-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || passwordsMismatch}
              className="w-full rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-3 font-medium"
            >
              {isPending ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="theme-muted mt-6 text-sm">
            Already registered,{" "}
            <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent)]">
              login here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
