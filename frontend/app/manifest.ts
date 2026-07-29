import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReelsDraft — AI Creator Workspace",
    short_name: "ReelsDraft",
    description:
      "Plan, write, and organize scroll-stopping content in one creator workspace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#05070b",
    theme_color: "#05070b",
    categories: ["productivity", "business", "social"],
    icons: [
      {
        src: "/icons/reelsdraft-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/reelsdraft-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/reelsdraft-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
