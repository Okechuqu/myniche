import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
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

const sections = [
  {
    id: "information",
    title: "Information we collect",
    body: "MyNiche collects account details such as your name, email address, creator niche, profile preferences, generated scripts, planner entries, and basic usage data needed to operate the product.",
    Icon: Database,
  },
  {
    id: "usage",
    title: "How we use information",
    body: "We use your information to authenticate your account, generate creator assets, personalize your workspace, maintain security, improve product quality, and communicate important account updates.",
    Icon: Sparkles,
  },
  {
    id: "ai-content",
    title: "AI-generated content",
    body: "Prompts and creator inputs may be processed by AI providers to generate scripts, plans, and related outputs. Avoid submitting sensitive personal information that is not needed for generation.",
    Icon: Bot,
  },
  {
    id: "sharing",
    title: "Data sharing",
    body: "We do not sell your personal information. We may share limited data with service providers that help us host, authenticate, analyze, email, or generate content for the service.",
    Icon: Shield,
  },
  {
    id: "security",
    title: "Security",
    body: "We use reasonable technical and organizational safeguards to protect account data, including authenticated API access and administrative controls.",
    Icon: LockKeyhole,
  },
  {
    id: "choices",
    title: "Your choices",
    body: "You can update your profile information from your workspace, request password resets, and contact us about account data questions or deletion requests.",
    Icon: SlidersHorizontal,
  },
];

const quickFacts = [
  "Account data powers personalization",
  "Generated content can use AI providers",
  "Personal information is not sold",
  "Profile details can be updated in-app",
];

export default function PrivacyPage() {
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
                  How MyNiche handles creator data.
                </h1>
                <p className="theme-muted mt-4 text-sm leading-6">
                  Last updated June 23, 2026. This policy explains what MyNiche
                  collects, why we collect it, and how creator workspace data is
                  used.
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
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="theme-muted flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  >
                    <span>{section.title}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-4">
              {sections.map(({ id, title, body, Icon }, index) => (
                <section
                  key={id}
                  id={id}
                  className="scroll-mt-28 rounded-lg bg-[var(--surface-soft)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="theme-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                      <Icon size={19} />
                    </div>
                    <div>
                      <div className="theme-muted text-xs font-semibold uppercase">
                        Policy node {String(index + 1).padStart(2, "0")}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
                      <p className="theme-muted mt-3 text-sm leading-6">
                        {body}
                      </p>
                    </div>
                  </div>
                </section>
              ))}

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
                      For privacy questions, contact the MyNiche team through
                      your account support channel or the email address provided
                      by the service operator.
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
