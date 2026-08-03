import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free AI Video Script Generator Demo",
  description:
    "Try ReelsDraft's AI script generator and create a sample short-form video script without opening an account.",
  path: "/demo",
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
