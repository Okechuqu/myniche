import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/demo", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/resources", priority: 0.8, changeFrequency: "weekly" as const },
  {
    path: "/resources/short-form-video-script-guide",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  { path: "/tools", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, ...route }) => ({
    url: absoluteUrl(path),
    ...route,
  }));
}
