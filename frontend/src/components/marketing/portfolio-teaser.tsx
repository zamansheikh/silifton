import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PortfolioCard } from "./portfolio-card";
import type { PortfolioItem } from "@/lib/types";

// Hand-picked order for the home page; anything missing is back-filled from
// the rest of the portfolio so the grid always has six cards.
const HOME_PICKS = ["classkhata", "voxa-rtc", "dearlive", "lifeque", "bangla-pdf", "zimo-live"];

export function PortfolioTeaser({ items }: { items: PortfolioItem[] }) {
  const byId = new Map(items.map((p) => [p.id, p]));
  const picked = HOME_PICKS.map((id) => byId.get(id)).filter((p): p is PortfolioItem => Boolean(p));
  const rest = items.filter((p) => !HOME_PICKS.includes(p.id));
  const featured = [...picked, ...rest].slice(0, 6);
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

        {/* Featured card spans 8 columns and 2 rows; two cards stack beside it,
            three more fill the row below. */}
        <div className="portfolio-grid">
          {featured.map((p, i) => (
            <PortfolioCard key={p.id} item={p} span={i === 0 ? 8 : 4} rowSpan={i === 0 ? 2 : 1} large={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
