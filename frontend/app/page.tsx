import PublicNavbar from "@/components/layout/public-navbar";
import Hero from "@/components/marketing/hero";
import FeatureGrid from "@/components/marketing/feature-grid";
import ResourcePreview from "@/components/marketing/resource-preview";
import PricingPreview from "@/components/marketing/pricing-preview";
import Footer from "@/components/marketing/footer";
import type { SiteContent } from "@/services/api/public.api";

interface HomePagePayload {
  hero?: {
    title?: string;
    subtitle?: string;
    slides?: Array<{
      title: string;
      subtitle: string;
      details: string;
    }>;
  };
  features?: Array<{
    title: string;
    description: string;
    accent?: string;
  }>;
  resourcePreview?: {
    heading?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    featureCards?: Array<{ title: string; description: string }>;
  };
  pricing?: {
    plans?: Array<{
      title: string;
      description: string;
      accent?: boolean;
      features?: string[];
    }>;
  };
  footer?: {
    footerGroups?: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    footerSignals?: Array<{ label: string; value: string }>;
  };
}

export const dynamic = "force-dynamic";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const defaultHomePagePayload = {
  hero: {
    title: "Create better content with less effort.",
    subtitle:
      "Generate scripts, organize ideas, plan campaigns, and stay consistent across every channel with a single creator workspace.",
    slides: [
      {
        title: "AI-powered script creation",
        subtitle: "Move from idea to publish-ready content in minutes.",
        details:
          "Generate voice-consistent scripts, social hooks, and content outlines with built-in guidance.",
      },
      {
        title: "Smart calendar planning",
        subtitle: "Keep your publishing rhythm moving forward.",
        details:
          "Visualize every release, deadline, and campaign moment in one fast creator workflow.",
      },
      {
        title: "Creator analytics made easy",
        subtitle: "See what works and iterate faster.",
        details:
          "Track performance trends, audience interest, and content momentum in a simple dashboard.",
      },
    ],
  },
  features: [
    {
      title: "AI Script Generator",
      description:
        "Turn rough ideas into polished scripts with adaptive prompts, tone control, and instant rewrites.",
      accent: "from-[#d4af37]/30 via-[#3b82f6]/20 to-transparent",
    },
    {
      title: "Content Planner",
      description:
        "Map campaigns across channels with intelligent sequencing, publishing checkpoints, and creative briefs.",
      accent: "from-[#3b82f6]/30 via-sky-500/20 to-transparent",
    },
    {
      title: "Content Calendar",
      description:
        "Visualize launches in real time and keep publishing momentum aligned with your growth goals.",
      accent: "from-[#3b82f6]/30 via-[#d4af37]/20 to-transparent",
    },
    {
      title: "Creator Toolkit",
      description:
        "Move from idea to output faster with reusable assets, hooks, and audience-ready messaging blocks.",
      accent: "from-[#d4af37]/30 via-[#3b82f6]/20 to-transparent",
    },
    {
      title: "Analytics",
      description:
        "Understand what resonates with your audience through clear insights and optimized performance signals.",
      accent: "from-emerald-500/30 via-green-500/20 to-transparent",
    },
    {
      title: "Team Collaboration",
      description:
        "Coordinate feedback, approvals, and launches effortlessly across your whole operation.",
      accent: "from-[#3b82f6]/30 via-[#d4af37]/20 to-transparent",
    },
  ],
  resourcePreview: {
    heading:
      "High-tech creative resources built for every stage of your launch.",
    description:
      "Discover exclusive creator workflows, AI prompt recipes, and dynamic tools to help you write faster, plan smarter, and stay ahead.",
    actionLabel: "Explore resources",
    actionHref: "/resources",
    featureCards: [
      {
        title: "AI creative recipes",
        description:
          "Browse instant prompts, templates, and frameworks built for modern creators.",
      },
      {
        title: "Research vault",
        description:
          "Access curated resources, case studies, and growth playbooks in one place.",
      },
      {
        title: "Performance insights",
        description:
          "Turn creator metrics into action with smart guidance and planning tips.",
      },
    ],
  },
  pricing: {
    plans: [
      {
        title: "Free",
        description: "Start with a limited creator workspace.",
        accent: true,
        features: [
          "20 scripts / month",
          "1 seat (individual)",
          "Standard support",
          "Basic planner & analytics",
        ],
      },
      {
        title: "Creator",
        description: "Unlimited scripts, planner, and pro workflows.",
        accent: false,
        features: [
          "Unlimited scripts",
          "Up to 5 seats",
          "Priority support",
          "Advanced planner & workflow automations",
        ],
      },
      {
        title: "Agency",
        description: "Team collaboration, analytics, and growth tools.",
        accent: false,
        features: [
          "Unlimited scripts & seats",
          "Team workspace & roles",
          "Advanced analytics",
          "White-labeling & SSO",
        ],
      },
    ],
  },
  footer: {
    footerGroups: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Tools", href: "/tools" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Resources", href: "/resources" },
          { label: "Privacy Policy", href: "/privacy" },
        ],
      },
    ],
    footerSignals: [
      { label: "Script engine", value: "Online" },
      { label: "Trend radar", value: "Live" },
      { label: "Planner core", value: "Synced" },
    ],
  },
};

async function getHomePageContent() {
  try {
    const response = await fetch(`${apiUrl}/public/content/home-page/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as SiteContent;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const homePageContent = await getHomePageContent();
  const payload =
    (homePageContent?.payload as HomePagePayload | undefined) ??
    defaultHomePagePayload;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PublicNavbar />

      <Hero
        title={payload.hero?.title}
        subtitle={payload.hero?.subtitle}
        slides={payload.hero?.slides}
      />

      <FeatureGrid features={payload.features} />

      <ResourcePreview
        heading={payload.resourcePreview?.heading}
        description={payload.resourcePreview?.description}
        actionLabel={payload.resourcePreview?.actionLabel}
        actionHref={payload.resourcePreview?.actionHref}
        featureCards={payload.resourcePreview?.featureCards}
      />

      <PricingPreview plans={payload.pricing?.plans} />

      <Footer
        footerGroups={payload.footer?.footerGroups}
        footerSignals={payload.footer?.footerSignals}
      />
    </main>
  );
}
