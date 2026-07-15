import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import ThemeProvider from "@/providers/theme-provider";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fallbackMetadata: Metadata = {
  title: "MyNiche",
  description: "AI Creator Operating System",
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

    const config = await response.json();
    return {
      title: config.seo_title || config.site_name || fallbackMetadata.title,
      description:
        config.seo_description ||
        config.site_description ||
        fallbackMetadata.description,
      icons: config.favicon_url ? { icon: config.favicon_url } : undefined,
      openGraph: {
        title: config.seo_title || config.site_name || fallbackMetadata.title,
        description:
          config.seo_description ||
          config.site_description ||
          fallbackMetadata.description,
        images: config.open_graph_image ? [config.open_graph_image] : undefined,
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
                  var theme = localStorage.getItem("myniche-theme") || "dark";
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
      </body>
    </html>
  );
}
