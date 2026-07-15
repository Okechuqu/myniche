"use client";

import NicheForm from "@/components/scripts/NicheForm";
import PublicNavbar from "@/components/layout/public-navbar";

export default function DemoPage() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--background)] px-6 py-16 text-[var(--foreground)]">
        <div className="mx-auto max-w-6xl">
          <NicheForm
            mode="demo"
            title="Try MyNiche for free"
            description="Generate one sample script without creating an account."
          />
        </div>
      </main>
    </>
  );
}
