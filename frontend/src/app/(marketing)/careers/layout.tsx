import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "Join a senior-only engineering studio. Open roles across platform, product, AI, mobile, and design — no junior engineers, no warm bodies.",
  path: "/careers",
});

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
