import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Products Silifton builds and runs — school management, mobile apps, developer tools and open-source libraries — with the engineering behind each.",
  path: "/portfolio",
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
