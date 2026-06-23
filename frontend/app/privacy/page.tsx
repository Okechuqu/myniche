import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";

const sections = [
  {
    title: "Information we collect",
    body: "MyNiche collects account details such as your name, email address, creator niche, profile preferences, generated scripts, planner entries, and basic usage data needed to operate the product.",
  },
  {
    title: "How we use information",
    body: "We use your information to authenticate your account, generate creator assets, personalize your workspace, maintain security, improve product quality, and communicate important account updates.",
  },
  {
    title: "AI-generated content",
    body: "Prompts and creator inputs may be processed by AI providers to generate scripts, plans, and related outputs. Avoid submitting sensitive personal information that is not needed for generation.",
  },
  {
    title: "Data sharing",
    body: "We do not sell your personal information. We may share limited data with service providers that help us host, authenticate, analyze, email, or generate content for the service.",
  },
  {
    title: "Security",
    body: "We use reasonable technical and organizational safeguards to protect account data, including authenticated API access and administrative controls.",
  },
  {
    title: "Your choices",
    body: "You can update your profile information from your workspace, request password resets, and contact us about account data questions or deletion requests.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-medium text-pink-300">Privacy Policy</p>
        <h1 className="mt-3 text-4xl font-bold">How MyNiche handles data</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          Last updated June 23, 2026. This policy explains what MyNiche
          collects, why we collect it, and how creator workspace data is used.
        </p>

        <div className="mt-10 space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            For privacy questions, contact the MyNiche team through your
            account support channel or the email address provided by the
            service operator.
          </p>
        </section>
      </section>

      <Footer />
    </main>
  );
}
