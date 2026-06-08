type Section = { heading: string; body: string[] };

export function LegalPage({
  eyebrow,
  title,
  effective,
  sections,
}: {
  eyebrow: string;
  title: string;
  effective: string;
  sections: Section[];
}) {
  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="eyebrow"><span className="dot" /> {eyebrow}</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(36px, 4.5vw, 60px)" }}>
            {title}
          </h1>
          <div className="mono" style={{ marginTop: 16, fontSize: 12, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Effective {effective}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          {sections.map((s, i) => (
            <div key={s.heading} style={{ paddingTop: i === 0 ? 0 : 32, paddingBottom: 32, borderBottom: i === sections.length - 1 ? "none" : "1px solid var(--border)" }}>
              <h2 className="h3" style={{ fontSize: 20, marginBottom: 14 }}>{s.heading}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, color: "var(--fg-dim)", fontSize: 15.5, lineHeight: 1.7 }}>
                {s.body.map((p, j) => (
                  <p key={j} style={{ margin: 0 }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
