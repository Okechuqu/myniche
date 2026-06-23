"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { googleLogin } from "@/services/api/auth.api";

type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: {
        initialize: (options: {
          client_id: string;
          callback: (response: any) => void;
        }) => void;
        renderButton: (container: HTMLElement, options: any) => void;
      };
    };
  };
};

export default function GoogleButton() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const win = window as GoogleWindow;

    const handleCredentialResponse = async (response: any) => {
      if (!response?.credential) return;

      try {
        const auth = await googleLogin({ token: response.credential });
        setSession({
          access: auth.access,
          refresh: auth.refresh,
          user: auth.user,
        });
        router.push("/");
      } catch (error: any) {
        if (error.response) {
          console.error("Server Error Details:", error.response.data);
        }
        console.error("Google login failed:", error);
      }
    };

    const initializeGoogle = () => {
      if (!win.google?.accounts?.id) return;

      // Only initialize if not already done
      if (!(win as any).googleInitialized) {
        win.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        (win as any).googleInitialized = true;
      }

      setReady(true);
    };

    if (win.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    // Check if script is already loading
    if ((win as any).googleScriptLoading) return;
    (win as any).googleScriptLoading = true;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  }, [router, setSession]);

  const handleClick = () => {
    const win = window as GoogleWindow;
    if (!win.google?.accounts?.id) {
      console.error("Google script not yet loaded");
      return;
    }
    win.google?.accounts?.id?.prompt();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready}
      id="google-btn"
      className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.35 11.1H12v2.8h5.7c-.25 1.5-1.5 3.5-5.7 3.5-3.4 0-6.2-2.8-6.2-6.2s2.8-6.2 6.2-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.7C17.95 2.7 15.2 1.2 12 1.2 6.1 1.2 1.2 6.1 1.2 12S6.1 22.8 12 22.8c6 0 9.7-4.2 9.7-10.2 0-.7-.1-1.2-.35-1.5z"
            fill="#4285F4"
          />
          <path
            d="M3.52 7.7l2.5 1.8c.7-1.5 2.2-2.7 4.3-2.7 1.4 0 2.6.5 3.4 1.4l2.5-2.5C13.6 4.3 12 3.7 10 3.7 6.5 3.7 3.5 5.9 3.5 7.7z"
            fill="#34A853"
          />
          <path
            d="M12 21.3c2.4 0 4.4-.8 5.9-2.2l-2.8-2.3c-.8.5-1.8.8-3.1.8-2.4 0-4.4-1.6-5.1-3.9l-2.5 1.9C5.5 19.8 8.5 21.3 12 21.3z"
            fill="#FBBC05"
          />
          <path
            d="M21.35 11.1H12v2.8h5.7c-.2 1.1-.8 2.1-1.7 2.8l2.8 2.3C20.6 17.6 22 14.8 22 12 22 11.3 21.8 10.5 21.35 11.1z"
            fill="#EA4335"
          />
        </svg>
      </span>
      Continue with Google
    </button>
  );
}
