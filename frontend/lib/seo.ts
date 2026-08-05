import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://reelsdraft.com";
const SOCIAL_IMAGE_PATH = "/icons/reelsdraft-512.png";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
).replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const socialImage = absoluteUrl(SOCIAL_IMAGE_PATH);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "ReelsDraft",
      title,
      description,
      images: [{ url: socialImage, width: 512, height: 512, alt: "ReelsDraft" }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [socialImage],
    },
  };
}
