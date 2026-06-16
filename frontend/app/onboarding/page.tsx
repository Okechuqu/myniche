"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function OnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [goal, setGoal] = useState("");

  const handleContinue = () => {
    const currentUser = useAuthStore.getState().user;

    if (currentUser) {
      setUser({
        ...currentUser,
        niche,
        creator_goal: goal,
      });
    }

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg items-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-3xl font-bold">Set up your creator profile</h1>
          <p className="mt-2 text-sm text-slate-400">
            Give MyNiche a few details, then the workspace tailors itself.
          </p>

          <div className="mt-8 space-y-4">
            <input
              placeholder="Your niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
            />

            <input
              placeholder="Main platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
            />

            <input
              placeholder="Creator goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              onClick={handleContinue}
              className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 py-3 font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
