"use client";

import { useEffect, useState } from "react";
import { onToast, type Toast } from "@/lib/toast";

const variantStyles: Record<Toast["variant"], string> = {
  success:
    "border-emerald-400/20 bg-emerald-500/10 ring-1 ring-emerald-400/15 text-emerald-100",
  error: "border-red-500/20 bg-red-500/10 ring-1 ring-red-500/15 text-red-100",
  info: "border-slate-600/60 bg-slate-950/95 ring-1 ring-slate-500/15 text-slate-100",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return onToast((toast) => {
      setToasts((current) => [toast, ...current]);

      const timeoutId = window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, toast.duration ?? 5000);

      return () => window.clearTimeout(timeoutId);
    });
  }, []);

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-full max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-3xl border p-4 shadow-2xl shadow-black/30 backdrop-blur-xl ${variantStyles[toast.variant]}`}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="text-sm leading-6 text-slate-300">
                  {toast.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
