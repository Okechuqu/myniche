"use client";

import Link from "next/link";
import { useId } from "react";

export default function PrivacyCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="theme-surface-soft group flex cursor-pointer items-start gap-3 rounded-3xl border p-4 transition hover:border-[var(--accent)]/40"
    >
      <span className="theme-input mt-1 flex h-6 w-6 items-center justify-center rounded-xl border text-transparent transition group-hover:border-[var(--accent)]/40">
        {checked ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-4 w-4 text-[var(--accent)]"
          >
            <path d="M6 13l4 4 8-8" />
          </svg>
        ) : null}
      </span>
      <div className="theme-muted text-sm leading-6">
        <span className="block font-semibold text-[var(--foreground)]">
          I agree to the{" "}
          <Link
            href="/privacy"
            className="text-[var(--accent)] underline transition hover:text-[var(--accent)]"
          >
            privacy policy
          </Link>
          .
        </span>
        <span>
          Read our privacy policy before registering.
        </span>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
