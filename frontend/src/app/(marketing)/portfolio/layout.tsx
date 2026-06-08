import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Case files from production engagements across fintech, healthtech, logistics, energy, and media — real systems, measurable outcomes.",
  path: "/portfolio",
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
