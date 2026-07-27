"use client";

import { useSyncExternalStore } from "react";
import { recordCookieConsent } from "@/services/api/auth.api";

type ConsentStatus = "accepted" | "rejected" | null;
const CONSENT_KEY = "reelsdraft-cookie-consent";
const CONSENT_ID_KEY = "reelsdraft-cookie-consent-id";
const CONSENT_CHANGE_EVENT = "reelsdraft-cookie-consent-change";
const CONSENT_VERSION = "2026-07-27";

type StoredConsent = {
  status: Exclude<ConsentStatus, null>;
  version: string;
};

function parseStoredConsent(value: string | null): ConsentStatus {
  if (!value) return null;

  try {
    const consent = JSON.parse(value) as StoredConsent;
    return consent.version === CONSENT_VERSION &&
      (consent.status === "accepted" || consent.status === "rejected")
      ? consent.status
      : null;
  } catch {
    return null;
  }
}

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;

  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    const stored = document.documentElement.dataset.cookieConsent;
    return stored === "accepted" || stored === "rejected" ? stored : null;
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

function getConsentId() {
  let consentId = window.localStorage.getItem(CONSENT_ID_KEY);
  if (!consentId) {
    consentId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    window.localStorage.setItem(CONSENT_ID_KEY, consentId);
  }
  return consentId;
}

export default function CookieConsent() {
  const status = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    () => null,
  );

  const saveConsent = async (value: Exclude<ConsentStatus, null>) => {
    try {
      await recordCookieConsent(value === "accepted", getConsentId());
    } catch {
      // ignore consent recording failures
    }
  };

  const setConsent = (value: Exclude<ConsentStatus, null>) => {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ status: value, version: CONSENT_VERSION }),
      );
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    } catch {
      // Keep the current-page dismissal functional when storage is unavailable.
      document.documentElement.dataset.cookieConsent = value;
    }

    void saveConsent(value);
  };

  const accept = () => {
    setConsent("accepted");
  };

  const reject = () => {
    setConsent("rejected");
  };

  if (status !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--foreground)]">
          We use essential browser storage for authentication and your theme preference.
          These are necessary to provide the signed-in service. We do not use advertising cookies.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm transition hover:bg-[var(--surface-soft)]"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-linear-to-r from-[#d4af37] via-[#3b82f6] to-[#05070b] px-4 py-2 text-sm font-medium text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
