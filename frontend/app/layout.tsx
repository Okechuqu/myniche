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

const fallbackMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL),
  title: {
    default: "ReelsDraft",
    template: "%s | ReelsDraft",
  },
  description: "AI Creator Operating System",
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
      { url: "/icons/reelsdraft-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/reelsdraft-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
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
      "AI Creator Operating System";
    const canonicalUrl = config.canonical_url || process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
    const images = config.open_graph_image ? [config.open_graph_image] : undefined;

    return {
      ...fallbackMetadata,
      metadataBase: new URL(canonicalUrl),
      title,
      description,
      icons: config.favicon_url ? { icon: config.favicon_url } : undefined,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: config.site_name || "ReelsDraft",
        title,
        description,
        images,
      },
      twitter: {
        card: "summary_large_image",
        site: config.twitter_site || undefined,
        title,
        description,
        images,
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
