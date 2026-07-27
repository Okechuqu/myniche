"use client";

import { useEffect, useState } from "react";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import {
  getSiteContentBySlug,
  getSiteConfiguration,
  type SiteContent,
  type SiteConfiguration,
} from "@/services/api/public.api";
import {
  Bot,
  CheckCircle2,
  Database,
  LockKeyhole,
  Mail,
  Shield,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

interface PrivacySection {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

const sections: PrivacySection[] = [
  {
    id: "information",
    title: "Information we collect",
    body: "ReelsDraft collects account details (email address and username), creator profile preferences, generated scripts, planner entries, analytics snapshots, and security/audit records. We do not request special-category personal data; do not include it in AI prompts or workspace content.",
    icon: "Database",
  },
  {
    id: "usage",
    title: "How we use information",
    body: "We process account and workspace data to perform our contract with you, maintain security, meet legal obligations, and pursue legitimate interests such as preventing abuse. We ask for your recorded agreement to this policy when an account is created. We do not use your workspace content for direct marketing without separate consent.",
    icon: "Sparkles",
  },
  {
    id: "lawful-basis",
    title: "Lawful basis for processing",
    body: "Our legal bases are: contract (providing the service), legitimate interest (security, abuse prevention), and legal obligation (retention, audit). Where required, we rely on explicit consent for optional processing such as direct marketing.",
    icon: "Shield",
  },
  {
    id: "ai-content",
    title: "AI-generated content",
    body: "Prompts and creator inputs are sent to the AI provider selected for the service (currently OpenAI or Google) solely to generate requested outputs. Avoid submitting personal or confidential information that is unnecessary for generation. Provider processing, retention, and international transfers are governed by the applicable data-processing agreement and transfer safeguards.",
    icon: "Bot",
  },
  {
    id: "sharing",
    title: "Data sharing",
    body: "We do not sell personal information. We use processors for hosting and profile storage (Supabase), authentication (Google), AI generation (OpenAI or Google), email delivery, and infrastructure. Data-processing agreements are in place with each provider. Where required, standard contractual clauses or equivalent safeguards govern international transfers.",
    icon: "Shield",
  },
  {
    id: "security",
    title: "Security",
    body: "We use authenticated API access, encryption in transit, access controls, rate limiting, audit logging, and production HTTPS settings. No system is perfectly secure; report suspected incidents through the privacy contact channel.",
    icon: "LockKeyhole",
  },
  {
    id: "choices",
    title: "Your choices",
    body: "You can correct profile data, download a portable JSON export, and permanently delete your account from Settings. You may also request access, restriction, objection, or rectification through the privacy contact channel. We respond within applicable legal time limits and may verify identity before acting.",
    icon: "SlidersHorizontal",
  },
];

const additionalSections: PrivacySection[] = [
  {
    id: "retention",
    title: "Retention",
    body: "Account-linked workspace data is retained while your account is active. Deleting an account removes Django records and the associated Supabase profile. Completed AI jobs and audit records are automatically removed according to the configured retention period. Backups and legally required records may persist for a limited, documented restoration or compliance period.",
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: "We use essential browser storage for authentication state and your theme preference. These are necessary to provide the signed-in service and are not used for advertising. If optional analytics or marketing technologies are added, they must remain disabled until you have made a separate opt-in choice.",
  },
  {
    id: "children",
    title: "Children",
    body: "The service is not directed at children. Do not create an account or submit personal data if you are below the minimum age required to consent to data processing where you live.",
  },
];

const iconMap: Record<string, typeof Database> = {
  Database,
  Sparkles,
  Bot,
  Shield,
  LockKeyhole,
  SlidersHorizontal,
};

function getPrivacySections(content: SiteContent | null) {
  if (!content?.payload?.sections || !Array.isArray(content.payload.sections)) {
    return [...sections, ...additionalSections];
  }

  return content.payload.sections
    .filter(
      (section: unknown) => typeof section === "object" && section !== null,
    )
    .map((section) => {
      const value = section as Record<string, unknown>;
      const title = typeof value.title === "string" ? value.title : "Untitled";
      const body = typeof value.body === "string"
        ? value.body
        : typeof value.description === "string"
          ? value.description
          : "";

      return {
      id:
        (typeof value.id === "string" && value.id) ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") ||
        "section",
      title,
      body,
      icon: typeof value.icon === "string" ? value.icon : undefined,
    };
    }) as PrivacySection[];
}

const quickFacts = [
  "Account data powers personalization",
  "Generated content can use AI providers",
  "Personal information is not sold",
  "Profile details can be updated in-app",
];

export default function PrivacyPage() {
  const [remoteContent, setRemoteContent] = useState<SiteContent | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfiguration | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [content, config] = await Promise.all([
          getSiteContentBySlug("privacy"),
          getSiteConfiguration(),
        ]);
        if (mounted) {
          if (content?.is_published) setRemoteContent(content);
          setSiteConfig(config);
        }
      } catch {
        // fallback to static content on any error
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(212,175,55,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute inset-x-4 top-8 h-44 bg-linear-to-r from-[#d4af37]/10 via-[#3b82f6]/10 to-[#05070b]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg bg-[var(--surface-soft)] p-5 shadow-[0_26px_80px_-60px_rgba(59,130,246,0.8)] backdrop-blur sm:p-6">
                <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                  {remoteContent?.title ?? "How ReelsDraft handles creator data."}
                </h1>
                <p className="theme-muted mt-4 text-sm leading-6">
                  {remoteContent?.updated_at
                    ? `Last updated ${new Date(remoteContent.updated_at).toLocaleDateString()}.`
                    : "Last updated June 23, 2026."}{" "}
                  {remoteContent
                    ? null
                    : "This policy explains what ReelsDraft collects, why we collect it, and how creator workspace data is used."}
                </p>

                <div className="mt-6 grid gap-2">
                  {quickFacts.map((fact) => (
                    <div
                      key={fact}
                      className="flex items-center gap-3 rounded-lg bg-[var(--surface)] px-3 py-2.5 text-sm"
                    >
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-500"
                      />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <nav className="mt-4 hidden rounded-lg bg-[var(--surface-soft)] p-3 backdrop-blur lg:block">
                {(remoteContent?.body ? [] : sections).map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="theme-muted flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  >
                    <span>{section.title}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </a>
                ))}
                {remoteContent?.body ? (
                  <div className="mt-2 text-sm theme-muted">
                    (See main text for sections)
                  </div>
                ) : null}
              </nav>
            </aside>

            <div className="space-y-4">
              {remoteContent?.body ? (
                <section className="scroll-mt-28 rounded-lg bg-[var(--surface-soft)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-6">
                  <div className="prose max-w-none whitespace-pre-wrap text-sm">
                    {remoteContent.body}
                  </div>
                </section>
              ) : (
                getPrivacySections(remoteContent).map(
                  ({ id, title, body, icon }) => {
                    const Icon = icon ? (iconMap[icon] ?? Database) : Database;
                    return (
                      <details
                        key={id}
                        id={id}
                        className="scroll-mt-28 rounded-lg bg-[var(--surface-soft)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-6"
                      >
                        <summary className="cursor-pointer list-none text-lg font-semibold outline-none transition hover:text-[var(--accent)]">
                          <div className="flex items-center gap-3">
                            <span className="theme-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                              <Icon size={19} />
                            </span>
                            <span>{title}</span>
                          </div>
                        </summary>
                        <div className="theme-muted mt-4 text-sm leading-6">
                          {body}
                        </div>
                      </details>
                    );
                  },
                )
              )}

              <section className="rounded-lg bg-[var(--surface)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="theme-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                    <Mail size={19} />
                  </div>
                  <div>
                    <div className="theme-muted text-xs font-semibold uppercase">
                      Contact
                    </div>
                    <h2 className="mt-2 text-xl font-semibold">
                      Questions about your data
                    </h2>
                    <p className="theme-muted mt-3 text-sm leading-6">
                      For privacy questions, contact the ReelsDraft team at{" "}
                      <span className="font-semibold text-[var(--foreground)]">
                        {siteConfig?.contact_email || "support@reelsdraft.example"}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
