import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Content Creator Tools Directory",
  description:
    "Discover practical tools for recording, editing, design, audio, content planning, and publishing.",
  path: "/tools",
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
