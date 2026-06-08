import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PortfolioCard } from "./portfolio-card";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioTeaser({ items }: { items: PortfolioItem[] }) {
  const featured = items.slice(0, 3);
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot" /> Recent work</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              Selected <em>case files</em>.
            </h2>
          </div>
          <Link className="btn btn-ghost" href="/portfolio">
            All case studies <Icon name="arrow" size={14} />
          </Link>
        </div>

        <div className="portfolio-grid">
          {featured.map((p, i) => (
            <PortfolioCard key={p.id} item={p} span={i === 0 ? 8 : 4} large={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
