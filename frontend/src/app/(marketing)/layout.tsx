import { AnalyticsBeacon } from "@/components/marketing/analytics-beacon";
import { Footer, type FooterContent } from "@/components/marketing/footer";
import { TopNav } from "@/components/marketing/top-nav";
import { getSiteSettings } from "@/lib/content";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const footer = (settings["site.footer"] ?? {}) as FooterContent;
  const social = (settings["site.social"] ?? {}) as NonNullable<FooterContent["social"]>;
  return (
    <div className="app">
      <TopNav />
      {children}
      <Footer content={{ ...footer, social }} />
      <AnalyticsBeacon />
    </div>
  );
}
