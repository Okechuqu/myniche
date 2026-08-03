import type { MetadataRoute } from "next";

const fallbackIcons: MetadataRoute.Manifest["icons"] = [
  {
    src: "/icons/favicon/icon0.svg",
    sizes: "any",
    type: "image/svg+xml",
    purpose: "any",
  },
  {
    src: "/icons/favicon/icon1.png",
    sizes: "96x96",
    type: "image/png",
    purpose: "any",
  },
];

async function fetchSiteConfiguration() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  try {
    const response = await fetch(`${apiUrl}/public/config/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as {
      site_name?: string;
      site_description?: string;
      favicon_url?: string;
    };
  } catch {
    return null;
  }
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await fetchSiteConfiguration();
  const icons: MetadataRoute.Manifest["icons"] = config?.favicon_url
    ? [{ src: config.favicon_url, purpose: "any" }]
    : fallbackIcons;

  return {
    name: config?.site_name || "ReelsDraft — AI Creator Workspace",
    short_name: config?.site_name || "ReelsDraft",
    description:
      config?.site_description ||
      "Plan, write, and organize scroll-stopping content in one creator workspace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#05070b",
    theme_color: "#05070b",
    categories: ["productivity", "business", "social"],
    icons,
  };
}
