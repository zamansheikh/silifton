import { CTABand } from "@/components/marketing/cta-band";
import { getPortfolio } from "@/lib/content";
import { PortfolioGrid } from "./portfolio-grid";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 0 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Case files</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Production work, <em>publicly logged.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Products we build and run ourselves, and the open source we publish. Client work is shared under NDA on request.
          </p>
          <PortfolioGrid items={items} />
        </div>
      </section>

      <CTABand />
    </>
  );
}
