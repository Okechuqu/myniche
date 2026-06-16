"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FacebookButton from "@/components/auth/facebook-button";
import GoogleButton from "@/components/auth/google-button";

const getErrorMessage = (error: any) => {
  if (!error) return "Login failed";

  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (typeof data === "object") {
      return Object.entries(data)
        .map(([key, value]) =>
          Array.isArray(value)
            ? `${key}: ${value.join(", ")}`
            : `${key}: ${value}`,
        )
        .join(" \n");
    }
  }

  return error?.message || "Login failed";
};

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate, isPending, error } = useLogin({
    onSuccess: () => {
      setSuccessMessage("Welcome back! Redirecting you to your dashboard.");
      window.setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
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

  useEffect(() => {
    if (!error) {
      return;
    }

    setApiError(getErrorMessage(error));
    const timer = window.setTimeout(() => {
      setApiError(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const onSubmit = (values: LoginInput) => {
    setApiError(null);
    setSuccessMessage(null);
    mutate(values);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Login to MyNiche</h1>
          <p className="mt-2 text-sm text-slate-400">
            Continue with your creator workspace.
          </p>

          <div className="mt-8 space-y-3">
            <GoogleButton />
            <FacebookButton />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
            <div className="relative flex justify-center text-xs text-slate-500">
              <span className="bg-slate-900 px-3">or sign in with email</span>
            </div>
          </div>

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

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 focus:border-pink-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            No account yet,{" "}
            <Link
              href="/register"
              className="text-pink-400 hover:text-pink-300"
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
