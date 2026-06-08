import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { getServices } from "@/lib/content";

export const revalidate = 60;

const MODELS = [
  {
    title: "Fixed-scope build",
    price: "from $80k",
    desc: "A defined product, milestone-billed. Best for greenfield builds and clear scope.",
    best: ["6–24 week projects", "Production handover", "Fixed milestone billing"],
    featured: false,
  },
  {
    title: "Embedded squad",
    price: "from $40k/mo",
    desc: "A team of senior engineers and designers, integrated into your roadmap as one cell.",
    best: ["3–12 month engagements", "Weekly delivery cadence", "Full source-of-truth access"],
    featured: true,
  },
  {
    title: "Advisory retainer",
    price: "from $12k/mo",
    desc: "Senior leadership in your inbox. Architecture review, hiring, due diligence on demand.",
    best: ["CTO-level office hours", "Code & RFC review", "Pre-IPO / fundraise support"],
    featured: false,
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Services</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            What we build,<br /><em>end to end.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Six core disciplines. We staff each engagement with senior practitioners from across them — never one specialism in isolation.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="svc-grid">
            {services.map((s) => (
              <div key={s.num} className="svc-cell">
                <div className="svc-num">{s.num} ——</div>
                <div className="svc-icon"><Icon name={s.icon as IconName} size={20} /></div>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
                <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div style={{ marginTop: 24 }}>
                  <Button variant="link" href="/contact">Learn more <Icon name="arrow" size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Engagement models</div>
          <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
            Three ways <em>to work</em> with us.
          </h2>

          <div className="grid-3" style={{ marginTop: 48 }}>
            {MODELS.map((m) => (
              <div
                key={m.title}
                className="card card-hover"
                style={{
                  padding: 28,
                  borderColor: m.featured ? "var(--accent)" : "var(--border)",
                  background: m.featured
                    ? "linear-gradient(180deg, rgba(79, 139, 255,0.04), transparent 60%), var(--surface-1)"
                    : undefined,
                }}
              >
                {m.featured && <span className="tag tag-accent" style={{ marginBottom: 16 }}>Most engagements</span>}
                <h3 style={{ fontSize: 22, margin: "8px 0 6px", letterSpacing: "-0.02em", fontWeight: 500 }}>{m.title}</h3>
                <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.price}</div>
                <p style={{ marginTop: 16, color: "var(--fg-mute)", fontSize: 14, lineHeight: 1.6 }}>{m.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
                  {m.best.map((b) => (
                    <li key={b} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5, color: "var(--fg-dim)" }}>
                      <Icon name="check" size={14} className="accent-text" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 22 }}>
                  <Button variant={m.featured ? "primary" : "ghost"} href="/contact">
                    Start a conversation <Icon name="arrow" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
