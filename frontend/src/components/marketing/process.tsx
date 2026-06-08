const STEPS = [
  { num: "i", title: "Map", body: "Two weeks of architecture interviews, code review and roadmap stress-testing. You get a written diagnosis, with or without us." },
  { num: "ii", title: "Form", body: "We assemble a squad — staff engineers, designers, ML — exactly fit to the work. No bench, no rotations." },
  { num: "iii", title: "Ship", body: "Weekly production releases. You see commits, dashboards and metrics. We stake our retainer on the SLA." },
  { num: "iv", title: "Hand over", body: "Full IP transfer, runbooks, on-call docs. We leave you with a team that can keep building without us." },
];

export function Process() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot" /> How we work</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              A four-step <em>operating system</em>.
            </h2>
          </div>
          <div style={{ maxWidth: 320, color: "var(--fg-mute)", fontSize: 14 }}>
            Used across 142 engagements. Same rhythm whether we&apos;re rebuilding a core banking
            system or shipping a 6-week MVP.
          </div>
        </div>
        <div className="process-list">
          {STEPS.map((s) => (
            <div key={s.num} className="process-item">
              <div className="process-num">{s.num}</div>
              <div className="process-body">
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
