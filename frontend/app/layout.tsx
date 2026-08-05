import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import ThemeProvider from "@/providers/theme-provider";
import CookieConsent from "@/components/shared/cookie-consent";
import PwaInstaller from "@/components/shared/pwa-installer";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FALLBACK_SITE_URL = "https://reelsdraft.com";
const FALLBACK_SOCIAL_IMAGE = "/icons/favicon/icon1.png";

const fallbackMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL),
  title: {
    default: "ReelsDraft",
    template: "%s | ReelsDraft",
  },
  description:
    "Create short-form video scripts, organize content ideas, and plan campaigns for Instagram Reels, TikTok, and YouTube Shorts.",
  applicationName: "ReelsDraft",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ReelsDraft",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/favicon/icon0.svg", type: "image/svg+xml" },
      { url: "/icons/favicon/icon1.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: [{ url: "/icons/favicon/favicon.ico" }],
    apple: [
      { url: "/icons/favicon/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ReelsDraft",
    title: "ReelsDraft",
    description:
      "Create short-form video scripts, organize content ideas, and plan campaigns for Instagram Reels, TikTok, and YouTube Shorts.",
    images: [{ url: FALLBACK_SOCIAL_IMAGE, width: 96, height: 96, alt: "ReelsDraft" }],
  },
  twitter: {
    card: "summary",
    title: "ReelsDraft",
    description:
      "Create short-form video scripts, organize content ideas, and plan campaigns for Instagram Reels, TikTok, and YouTube Shorts.",
    images: [FALLBACK_SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05070b",
};

async function fetchSiteConfiguration(): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const response = await fetch(`${apiUrl}/public/config/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackMetadata;
    }

    const config = await response.json() as {
      site_name?: string;
      site_description?: string;
      seo_title?: string;
      seo_description?: string;
      favicon_url?: string;
      open_graph_image?: string;
      canonical_url?: string;
      twitter_site?: string;
    };
    const title = config.seo_title || config.site_name || "ReelsDraft";
    const description =
      config.seo_description ||
      config.site_description ||
      "AI script generator and content planner for short-form video creators.";
    const canonicalUrl = config.canonical_url || process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
    const socialImage =
      config.open_graph_image || config.favicon_url || FALLBACK_SOCIAL_IMAGE;

    return {
      ...fallbackMetadata,
      metadataBase: new URL(canonicalUrl),
      title,
      description,
      icons: config.favicon_url
        ? {
            icon: [{ url: config.favicon_url }],
            shortcut: [{ url: config.favicon_url }],
            apple: [{ url: config.favicon_url }],
          }
        : fallbackMetadata.icons,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: config.site_name || "ReelsDraft",
        title,
        description,
        images: [{ url: socialImage, alt: config.site_name || "ReelsDraft" }],
      },
      twitter: {
        card: config.open_graph_image ? "summary_large_image" : "summary",
        site: config.twitter_site || undefined,
        title,
        description,
        images: [socialImage],
      },
    };
  } catch {
    return fallbackMetadata;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return fetchSiteConfiguration();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("reelsdraft-theme") || "dark";
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
        <CookieConsent />
        <PwaInstaller />
      </body>
    </html>
  );
}
