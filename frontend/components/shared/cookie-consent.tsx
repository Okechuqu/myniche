"use client";

import { useSyncExternalStore } from "react";

type NoticeStatus = "acknowledged" | null;
const CONSENT_KEY = "reelsdraft-cookie-consent";
const CONSENT_CHANGE_EVENT = "reelsdraft-cookie-consent-change";
const CONSENT_VERSION = "2026-07-27";

type StoredConsent = {
  status: "acknowledged" | "accepted" | "rejected";
  version: string;
};

function parseStoredConsent(value: string | null): NoticeStatus {
  if (!value) return null;

  try {
    const consent = JSON.parse(value) as StoredConsent;
    const previouslyAnswered =
      consent.status === "acknowledged" ||
      consent.status === "accepted" ||
      consent.status === "rejected";

    return consent.version === CONSENT_VERSION && previouslyAnswered
      ? "acknowledged"
      : null;
  } catch {
    return null;
  }
}

function getStoredConsent(): NoticeStatus {
  if (typeof window === "undefined") return null;

  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    const stored = document.documentElement.dataset.cookieConsent;
    return stored === "acknowledged" ||
      stored === "accepted" ||
      stored === "rejected"
      ? "acknowledged"
      : null;
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) onStoreChange();
  };

  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export default function CookieConsent() {
  const status = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    () => null,
  );

  const acknowledge = () => {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ status: "acknowledged", version: CONSENT_VERSION }),
      );
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    } catch {
      // Keep the current-page dismissal functional when storage is unavailable.
      document.documentElement.dataset.cookieConsent = "acknowledged";
    }
  };

  if (status !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--foreground)]">
          ReelsDraft uses essential browser storage for login, security, and
          preferences such as your theme. It is required for the service to work
          and does not enable advertising or optional tracking.
        </p>
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={acknowledge}
            className="rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-2 text-sm font-medium text-white"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
