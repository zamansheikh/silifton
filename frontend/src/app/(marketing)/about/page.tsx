import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getTeam } from "@/lib/content";

export const revalidate = 60;

const PRINCIPLES: Array<[string, string]> = [
  ["Senior only", "Every commit is by someone with 8+ years in production."],
  ["Production or it didn't happen", "We don't ship demos, prototypes or proofs."],
  ["One squad, one mission", "No matrixed teams. No shared resources."],
  ["Write it down", "Every decision in an RFC. Every system in a runbook."],
  ["Stay until the metric moves", "We define success in numbers before we start."],
];

const NUMBERS: Array<[string, string]> = [
  ["38", "People worldwide"],
  ["3.4 yr", "Avg. engagement"],
  ["142", "Products shipped"],
  ["98%", "Client retention"],
  ["$2.4B", "Customer volume served"],
  ["18", "Industries served"],
  ["0", "Junior engineers"],
  ["7 d", "Avg. time to first commit"],
];

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> About</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            <span style={{ display: "block", maxWidth: "18ch" }}>
              A studio of <em>operators</em>, not consultants.
            </span>
          </h1>
        </div>
      </section>

      <section style={{ padding: "40px 0 100px" }}>
        <div className="wrap grid-split">
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-dim)" }}>
              <span className="serif" style={{ fontSize: 64, lineHeight: 0.8, float: "left", marginRight: 12, marginTop: 6, color: "var(--accent)" }}>T</span>
              ecsior was founded in 2019 by engineers who&apos;d led platform teams
              at scaled software companies and grew tired of consultancies that sold the senior
              and staffed the junior.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-mute)", marginTop: 24 }}>
              Today we are 38 people across Dhaka, London and Lagos. Every engineer
              you meet in a sales call is the engineer who writes code on your project.
              No revolving door. No bait-and-switch.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-mute)", marginTop: 16 }}>
              We measure our success by the depth of our client relationships.
              The average engagement length is 3.4 years. Eight of our top ten clients
              have been with us since their first year.
            </p>
          </div>
          <div>
            <div className="panel" style={{ padding: 32 }}>
              <div className="eyebrow"><span className="dot" /> Operating principles</div>
              <div style={{ marginTop: 24 }}>
                {PRINCIPLES.map(([k, v], i) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, padding: "16px 0", borderBottom: i < PRINCIPLES.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div className="mono" style={{ color: "var(--fg-faint)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{k}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 13.5, lineHeight: 1.55 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-l">
              <div className="eyebrow"><span className="dot" /> Leadership</div>
              <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
                The people <em>accountable</em>.
              </h2>
            </div>
            <Button variant="ghost" href="/careers">
              See open roles <Icon name="arrow" size={14} />
            </Button>
          </div>
          <div className="grid-3">
            {team.map((t) => (
              <div key={t.name} className="card card-hover" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {t.avatar ? (
                    <div
                      aria-hidden
                      style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: `url(${t.avatar}) center/cover`,
                        border: "1px solid var(--border)",
                      }}
                    />
                  ) : (
                    <div className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{t.initials}</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.name}</div>
                    <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                  <span className="mono" style={{ color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Focus</span>
                  <span style={{ color: "var(--fg-dim)" }}>{t.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-l">
              <div className="eyebrow"><span className="dot" /> By the numbers</div>
              <h2 className="h2 display-mix" style={{ marginTop: 16 }}>Silifton, <em>in figures</em>.</h2>
            </div>
          </div>
          <div className="grid-4">
            {NUMBERS.map(([n, l]) => (
              <div key={l} className="panel" style={{ padding: 28 }}>
                <div className="stat-num gradient-text">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
