"use client";

import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import { useEffect, useState } from "react";
import { getTermsOfService, type TermsOfService } from "@/services/api/public.api";

interface TermsSection {
  id: string;
  title: string;
  body: string;
}

const defaultTerms: TermsSection[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    body: "You must be at least 16 years old or have valid parental/guardian consent to use this service, in accordance with applicable local law.",
  },
  {
    id: "accounts",
    title: "Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
  },
  {
    id: "content",
    title: "Generated content",
    body: "AI-generated outputs are provided for your review. You own the outputs you create using the service, subject to our processor agreements with AI providers.",
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: "You may not use the service for unlawful purposes, to generate harmful content, or to abuse the platform or its providers.",
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: "To the fullest extent permitted by law, ReelsDraft and its operators shall not be liable for indirect, incidental, or consequential damages arising from use of the service.",
  },
  {
    id: "changes",
    title: "Changes to terms",
    body: "We may revise these terms from time to time. Material changes will be communicated through the service or via email. Continued use after changes means you accept the revised terms.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "For questions about these terms, contact us through the privacy contact channel provided in the service.",
  },
];

export default function TermsPage() {
  const [remoteTerms, setRemoteTerms] = useState<TermsOfService | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTermsOfService();
        if (mounted && data?.sections) setRemoteTerms(data);
      } catch {
        // use default terms
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sections = remoteTerms?.sections ?? defaultTerms;
  const version = remoteTerms?.version ?? "2026-07-21";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
          <p className="theme-muted mt-2 text-sm">
            Version {version}. By using ReelsDraft, you agree to these terms.
          </p>
          <div className="mt-8 space-y-4">
            {sections.map((section: TermsSection) => (
              <details
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-lg bg-[var(--surface-soft)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-6"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold outline-none transition hover:text-[var(--accent)]">
                  {section.title}
                </summary>
                <div className="theme-muted mt-4 text-sm leading-6">
                  {section.body}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
