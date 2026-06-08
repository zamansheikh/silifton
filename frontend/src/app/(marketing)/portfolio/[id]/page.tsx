import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { getPortfolio } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await getPortfolio();
  const item = items.find((p) => p.id === id);
  if (!item) {
    return buildMetadata({ title: "Case file not found", path: `/portfolio/${id}`, noIndex: true });
  }
  return buildMetadata({
    title: `${item.client} — ${item.title}`,
    description: item.summary,
    path: `/portfolio/${item.id}`,
    image: item.image,
    type: "article",
  });
}

export default async function CaseFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await getPortfolio();
  const item = items.find((p) => p.id === id);
  if (!item) notFound();

  const others = items.filter((p) => p.id !== id).slice(0, 3);
  const paragraphs = (item.body ?? "").split("\n\n").filter(Boolean);

  return (
    <article>
      <section className="section" style={{ paddingTop: 60, paddingBottom: 32 }}>
        <div className="wrap" style={{ maxWidth: 920 }}>
          <Link href="/portfolio" className="btn btn-link" style={{ marginBottom: 16 }}>
            ← All case files
          </Link>
          <div className="eyebrow" style={{ marginTop: 16 }}>
            <span className="dot" /> {item.industry} · {item.id}
          </div>
          <div className="mono" style={{ marginTop: 12, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-mute)" }}>
            {item.client}
          </div>
          <h1
            className="h1 display-mix"
            style={{ marginTop: 16, fontSize: "clamp(34px, 4.8vw, 64px)", lineHeight: 1.05 }}
          >
            {item.title}
          </h1>
          {item.summary && (
            <p className="lead" style={{ marginTop: 24 }}>
              {item.summary}
            </p>
          )}
        </div>
      </section>

      {item.image && (
        <section style={{ paddingBottom: 48 }}>
          <div className="wrap" style={{ maxWidth: 1200 }}>
            <div
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 24,
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                }}
              >
                {item.year} · {item.id}
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap grid-split-form" style={{ maxWidth: 1100, alignItems: "start" }}>
          <div>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: "var(--fg-dim)",
                    marginBottom: 22,
                  }}
                >
                  {para}
                </p>
              ))
            ) : (
              <p style={{ color: "var(--fg-mute)", fontStyle: "italic" }}>
                Case file write-up coming soon.
              </p>
            )}

            <div
              style={{
                marginTop: 40,
                paddingTop: 28,
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Button variant="primary" href="/contact">
                Start a project <Icon name="arrow" size={14} />
              </Button>
              <Button variant="ghost" href="/portfolio">
                More case files
              </Button>
            </div>
          </div>

          <aside>
            <div className="panel" style={{ padding: 24, position: "sticky", top: 84 }}>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--fg-faint)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Outcomes
              </div>
              <div className="stat-num accent-text" style={{ fontSize: 36 }}>
                {item.metric}
              </div>

              <dl style={{ marginTop: 24, fontSize: 13.5, lineHeight: 1.6, color: "var(--fg-dim)" }}>
                {[
                  ["Client", item.client],
                  ["Industry", item.industry],
                  ["Year", String(item.year)],
                  ["Status", item.status],
                  ["Reference", item.id],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr",
                      gap: 12,
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <dt className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {k}
                    </dt>
                    <dd style={{ margin: 0 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="section-head">
              <div className="section-head-l">
                <div className="eyebrow"><span className="dot" /> More work</div>
                <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
                  Other <em>case files</em>.
                </h2>
              </div>
              <Link className="btn btn-ghost" href="/portfolio">
                All case files <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div className="portfolio-grid">
              {others.map((p) => (
                <PortfolioCard key={p.id} item={p} span={4} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
