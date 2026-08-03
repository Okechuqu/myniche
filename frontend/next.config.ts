import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.153"],
  async headers() {
    return [
      {
        source:
          "/(dashboard|scripts|planner|profile|settings|onboarding|forgot-password|reset-password|auth)(/:path*)?",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
