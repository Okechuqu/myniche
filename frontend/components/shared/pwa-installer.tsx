"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstaller() {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = () => {
        navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
          console.error("Service worker registration failed:", error);
        });
      };

      window.addEventListener("load", registerServiceWorker);

      if (document.readyState === "complete") {
        registerServiceWorker();
      }

      return () => window.removeEventListener("load", registerServiceWorker);
    }
  }, []);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const handleInstalled = () => setInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!installPrompt) {
    return null;
  }

  const installApp = async () => {
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <button
      type="button"
      onClick={installApp}
      className="theme-surface theme-elevated fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] sm:bottom-6 sm:right-6"
      aria-label="Install ReelsDraft app"
    >
      <Download size={17} className="text-[var(--accent)]" />
      Install app
    </button>
  );
}
