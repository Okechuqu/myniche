"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/features/auth/hooks/use-login";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import GoogleButton from "@/components/auth/google-button";
import PrivacyCheckbox from "./PrivacyCheckbox";
import TermsCheckbox from "./TermsCheckbox";
import { getApiErrorMessage } from "@/lib/api-error";

const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  return getApiErrorMessage(error, "Registration failed. Please try again.");
};

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useRegister({
    redirectOnSuccess: false,
    onSuccess: () => {
      setSuccessMessage("Account created successfully! Redirecting...");
      window.setTimeout(() => {
        router.replace("/onboarding");
      }, 2000);
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
    control,
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

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const confirmPasswordValue =
    useWatch({ control, name: "confirmPassword" }) ?? "";
  const passwordsMismatch =
    confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const onSubmit = (values: RegisterInput) => {
    if (!privacyChecked) {
      setApiError("You must agree to the privacy policy before registering.");
      return;
    }

    if (!termsChecked) {
      setApiError("You must agree to the terms of service before registering.");
      return;
    }

    setApiError(null);
    mutate({
      email: values.email,
      username: values.username,
      password: values.password,
      agreed_to_privacy: privacyChecked,
      agreed_to_terms: termsChecked,
    });
  };

  const registerErrorMessage = apiError;

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

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[minmax(0,0.9fr)_minmax(580px,1.1fr)]">
        <section className="sticky top-0 hidden h-screen flex-col justify-between px-10 py-10 lg:flex xl:px-16 xl:py-12">
          <Link
            href="/"
            className="theme-muted mb-7 inline-flex items-center gap-2 text-sm transition hover:text-[var(--foreground)] lg:mb-9"
          >
            <Home size={16} />
            ReelsDraft
          </Link>

          <div className="max-w-xl py-5">
            <h2 className="text-5xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Your next great piece of content starts{" "}
              <span className="bg-linear-to-r from-[#d4af37] to-[#60a5fa] bg-clip-text text-transparent">
                right here.
              </span>
            </h2>
            <p className="theme-muted mt-6 max-w-lg text-lg leading-8">
              Build a creator workspace that helps you move from scattered ideas
              to consistent, publish-ready content.
            </p>

            <div className="theme-surface-soft mt-10 flex max-w-lg items-start gap-4 rounded-2xl border p-5">
              <ShieldCheck
                size={24}
                className="mt-0.5 shrink-0 text-[var(--accent-secondary)]"
              />
              <div>
                <p className="font-semibold">Your data stays yours</p>
                <p className="theme-muted mt-1 text-sm leading-6">
                  We use secure authentication and clear privacy controls to
                  protect your creator workspace.
                </p>
              </div>
            </div>
          </div>

          <p className="theme-muted text-sm">
            © {new Date().getFullYear()} ReelsDraft. Built for creators.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 sm:py-10 lg:border-l lg:border-[var(--border)] lg:bg-[var(--surface-soft)]/25 lg:px-10 xl:px-16">
          <div className="theme-surface theme-elevated w-full max-w-[680px] rounded-2xl border p-6 sm:rounded-3xl sm:p-9 xl:p-11">
            <Link
              href="/"
              className="theme-muted mb-7 inline-flex items-center gap-2 text-sm transition hover:text-[var(--foreground)] lg:mb-9"
            >
              <Home size={16} />
              ReelsDraft
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create your account
            </h1>
            <p className="theme-muted mt-3 text-sm leading-6 sm:text-base">
              Set up your ReelsDraft creator workspace in minutes.
            </p>

            <div className="mt-7 space-y-3 sm:mt-8">
              <GoogleButton
                agreedToPrivacy={privacyChecked}
                requirePrivacyAcceptance
                agreedToTerms={termsChecked}
                requireTermsAcceptance
                hoverText={
                  privacyChecked && termsChecked
                    ? "Create your account securely with Google"
                    : "Accept the privacy policy and terms to continue with Google"
                }
              />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
              <div className="theme-muted relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-3">
                  or create your account manually
                </span>
              </div>
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                  >
                    Email
                  </label>
                  <input
                    id="register-email"
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
                  <label
                    htmlFor="register-username"
                    className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                  >
                    Username
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Your creator name"
                    className="theme-input w-full rounded-xl border px-4 py-3.5 outline-none transition focus:ring-3 focus:ring-[var(--accent-secondary-soft)]"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className="theme-input w-full rounded-xl border py-3.5 pl-4 pr-12 outline-none transition focus:ring-3 focus:ring-[var(--accent-secondary-soft)]"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="theme-muted absolute inset-y-0 right-0 flex w-12 items-center justify-center transition hover:text-[var(--foreground)]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {passwordValue.length > 0 && (
                  <div>
                    <label
                      htmlFor="register-password-confirmation"
                      className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="register-password-confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        className="theme-input w-full rounded-xl border py-3.5 pl-4 pr-12 outline-none transition focus:ring-3 focus:ring-[var(--accent-secondary-soft)]"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((visible) => !visible)
                        }
                        className="theme-muted absolute inset-y-0 right-0 flex w-12 items-center justify-center transition hover:text-[var(--foreground)]"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password confirmation"
                            : "Show password confirmation"
                        }
                        aria-pressed={showConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
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
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <PrivacyCheckbox
                  checked={privacyChecked}
                  onChange={setPrivacyChecked}
                />

                <TermsCheckbox
                  checked={termsChecked}
                  onChange={setTermsChecked}
                />
              </div>

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
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#1d4ed8] px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:-translate-y-0.5 hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isPending ? "Creating..." : "Create account"}
                {!isPending && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="theme-muted mt-7 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[var(--accent)] hover:text-[var(--accent)]"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
