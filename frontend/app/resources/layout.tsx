import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Content Planning & Script Writing Resources",
  description:
    "Practical guides, frameworks, and creator resources for writing video scripts and building a consistent content workflow.",
  path: "/resources",
});

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
