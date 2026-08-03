import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import Footer from "@/components/marketing/footer";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How to Write Short-Form Video Scripts That Hold Attention",
  description:
    "Use this practical hook, value, proof, and call-to-action framework to write stronger scripts for Reels, TikTok, and YouTube Shorts.",
  path: "/resources/short-form-video-script-guide",
});

const sections = [
  {
    title: "1. Start with one specific viewer problem",
    body: "A short video has room for one useful promise. Define the viewer, the problem, and the outcome before writing. ‘Three ways freelance designers can stop losing revisions’ is clearer than ‘tips for freelancers’ because the right viewer immediately knows why the video matters.",
  },
  {
    title: "2. Write a hook that earns the next sentence",
    body: "A useful hook creates relevance without hiding the subject. Lead with a costly mistake, a concrete result, a surprising observation, or a direct question. Avoid empty suspense such as ‘wait until the end.’ The opening should still make sense when it appears without a caption.",
  },
  {
    title: "3. Deliver value in a visible sequence",
    body: "Arrange the body as two or three steps, a before-and-after, or a problem-and-fix sequence. Keep each sentence focused on one idea and remove background information the viewer does not need. Add visual direction only where it makes the explanation easier to follow.",
  },
  {
    title: "4. Add proof instead of extra claims",
    body: "A quick demonstration, real example, screen recording, result, or lesson from experience is more persuasive than another adjective. If you cannot verify a number, do not use it. Specific and defensible examples make both the video and the page supporting it more trustworthy.",
  },
  {
    title: "5. End with one natural next step",
    body: "Match the call to action to the video. Ask viewers to save a process they will reuse, comment with a relevant question, try the method, or open a related resource. One clear action is usually stronger than asking for a follow, comment, share, and purchase at once.",
  },
];

export default function ShortFormVideoScriptGuidePage() {
  const published = "2026-08-03";
  const url = absoluteUrl("/resources/short-form-video-script-guide");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Write Short-Form Video Scripts That Hold Attention",
    description:
      "A practical framework for writing scripts for Reels, TikTok, and YouTube Shorts.",
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "ReelsDraft Editorial" },
    publisher: {
      "@type": "Organization",
      name: "ReelsDraft",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icons/reelsdraft-512.png"),
      },
    },
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PublicNavbar />
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <nav aria-label="Breadcrumb" className="theme-muted text-sm">
          <Link className="hover:text-[var(--foreground)]" href="/resources">
            Resources
          </Link>{" "}
          / Script writing
        </nav>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Practical guide
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            How to write short-form video scripts that hold attention
          </h1>
          <p className="theme-muted mt-6 text-lg leading-8">
            A repeatable framework for turning one useful idea into a clear
            Instagram Reel, TikTok, or YouTube Short—without filler or forced
            engagement tricks.
          </p>
          <p className="theme-muted mt-4 text-sm">
            By ReelsDraft Editorial · Published August 3, 2026 · 8 minute read
          </p>
        </header>

        <section className="theme-surface-soft mt-10 rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">The four-part script</h2>
          <ol className="theme-muted mt-4 list-decimal space-y-2 pl-5 leading-7">
            <li><strong className="text-[var(--foreground)]">Hook:</strong> name the relevant problem or result.</li>
            <li><strong className="text-[var(--foreground)]">Value:</strong> explain the useful steps in a logical order.</li>
            <li><strong className="text-[var(--foreground)]">Proof:</strong> demonstrate the advice with a concrete example.</li>
            <li><strong className="text-[var(--foreground)]">Next step:</strong> give the viewer one relevant action.</li>
          </ol>
        </section>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="theme-muted mt-3 leading-8">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-[var(--border)] pt-10">
          <h2 className="text-2xl font-semibold">Example: turn a broad idea into a script</h2>
          <div className="theme-surface-soft mt-5 space-y-4 rounded-2xl border p-6 leading-7">
            <p><strong>Broad idea:</strong> How to stay consistent with content.</p>
            <p><strong>Hook:</strong> “If content planning takes your entire Sunday, your system is too complicated.”</p>
            <p><strong>Value:</strong> Choose three recurring topics, give each one a repeatable format, and schedule one recording block instead of planning every post from scratch.</p>
            <p><strong>Proof:</strong> Show the three topics and their next publish dates on a simple calendar.</p>
            <p><strong>Next step:</strong> “Save this and choose your three topics before planning next week.”</p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--accent)]/40 p-6">
          <h2 className="text-2xl font-semibold">Draft your next script</h2>
          <p className="theme-muted mt-3 leading-7">
            Use the framework manually, or give ReelsDraft your audience, topic,
            tone, and goal to create a first draft you can edit in your own voice.
          </p>
          <Link
            href="/demo"
            className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-5 py-3 font-semibold text-black"
          >
            Try the free script demo
          </Link>
        </section>
      </article>
      <Footer />
    </main>
  );
}
