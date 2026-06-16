"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { facebookLogin } from "@/services/api/auth.api";

type FbWindow = Window & {
  fbAsyncInit?: () => void;
  FB?: {
    init: (options: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    login: (
      callback: (response: any) => void,
      options?: { scope: string },
    ) => void;
  };
};

export default function FacebookButton() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as FbWindow;

    if (win.FB) {
      setReady(true);
      return;
    }

    win.fbAsyncInit = function () {
      win.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "",
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });

      setReady(true);
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    const win = window as FbWindow;
    if (!win.FB) return;

    win.FB.login(
      async (response: any) => {
        if (!response?.authResponse) return;

        const res = await facebookLogin({
          token: response.authResponse.accessToken,
        });

        setSession({
          access: res.access,
          refresh: res.refresh,
          user: res.user,
        });

        router.push("/dashboard");
      },
      { scope: "email" },
    );
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={!ready}
      className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.12 8.44 9.9v-7.02H8.08v-2.88h2.36V9.79c0-2.34 1.4-3.63 3.55-3.63 1.03 0 2.1.18 2.1.18v2.3h-1.18c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.88h-2.2v7.02C18.34 21.18 22 17.06 22 12.07z"
            fill="currentColor"
          />
        </svg>
      </span>
      Continue with Facebook
    </button>
  );
}
