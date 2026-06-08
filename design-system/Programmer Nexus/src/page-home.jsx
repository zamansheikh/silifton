/* global React, I, Btn, Sparkline, SERVICES, PORTFOLIO, TEAM, POSTS, CAREERS, TESTIMONIALS */
const { useState, useEffect } = React;

// =============================================================
// HERO VARIANTS
// =============================================================

function HeroAnimated({ onCta }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-grid"></div>
        <div className="hero-glow-a"></div>
        <div className="hero-glow-b"></div>
      </div>
      <div className="wrap hero-inner">
        <div className="fade-up" style={{ maxWidth: 1000 }}>
          <div className="eyebrow"><span className="dot"></span> Programmer Nexus / Engineered software</div>
          <h1 className="h1 gradient-text display-mix" style={{ marginTop: 28 }}>
            We build the software<br/>
            <em>serious teams</em> stake<br/>
            their roadmap on.
            <span className="sup">est. 2019</span>
          </h1>
          <p className="lead" style={{ marginTop: 32 }}>
            A senior-only engineering studio for fintech, health, and AI-native products.
            We embed with your team, ship to production, and stay until the metric moves.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg" onClick={onCta}>
              Start a project <I.arrow style={{ width: 16, height: 16 }} />
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => window.__nav("portfolio")}>
              See selected work
            </Btn>
          </div>
        </div>

        <div className="hero-statline fade-up fade-up-d2">
          <div>
            <div className="stat-num">142</div>
            <div className="stat-label">Products shipped</div>
          </div>
          <div>
            <div className="stat-num">$2.4B</div>
            <div className="stat-label">Volume served</div>
          </div>
          <div>
            <div className="stat-num">98.4%</div>
            <div className="stat-label">SLA retention</div>
          </div>
          <div>
            <div className="stat-num">12</div>
            <div className="stat-label">Countries · clients</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSplit({ onCta }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-grid"></div>
        <div className="hero-glow-a" style={{ opacity: 0.35 }}></div>
      </div>
      <div className="wrap hero-inner">
        <div className="hero-split">
          <div className="fade-up">
            <div className="eyebrow"><span className="dot"></span> Senior engineering · since 2019</div>
            <h1 className="h1 gradient-text display-mix" style={{ marginTop: 28, fontSize: "clamp(40px, 5.5vw, 76px)" }}>
              Engineering<br/>
              that ships to <em>production</em>.
            </h1>
            <p className="lead" style={{ marginTop: 28 }}>
              Embedded squads of senior engineers, designers and ML practitioners.
              We replace the consultancy you don't trust with the team you wish you'd hired.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Btn variant="primary" size="lg" onClick={onCta}>
                Book a discovery call <I.arrow style={{ width: 16, height: 16 }} />
              </Btn>
              <Btn variant="ghost" size="lg" onClick={() => window.__nav("services")}>
                What we do
              </Btn>
            </div>
          </div>
          <div className="fade-up fade-up-d2">
            <div className="code-card">
              <div className="code-head">
                <span className="code-dot"></span><span className="code-dot"></span><span className="code-dot"></span>
                <span className="code-title">engagement.ts — programmer-nexus</span>
              </div>
              <div className="code-body">
                <div><span className="c">// What you get on day one</span></div>
                <div><span className="k">const</span> <span className="f">engagement</span> = <span className="k">await</span> <span className="f">nexus</span>.<span className="f">start</span>({"{"}</div>
                <div>&nbsp;&nbsp;<span className="f">team</span>: [<span className="s">"staff-eng"</span>, <span className="s">"design"</span>, <span className="s">"ml"</span>],</div>
                <div>&nbsp;&nbsp;<span className="f">cadence</span>: <span className="s">"4-day delivery"</span>,</div>
                <div>&nbsp;&nbsp;<span className="f">commit</span>: <span className="s">"production by week 6"</span>,</div>
                <div>&nbsp;&nbsp;<span className="f">guarantees</span>: {"{"}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="f">sla</span>: <span className="n">99.9</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="f">handover</span>: <span className="s">"full IP transfer"</span>,</div>
                <div>&nbsp;&nbsp;{"}"}</div>
                <div>{"})"};</div>
                <div style={{ marginTop: 8 }}><span className="c">// → engagement #2418 · Meridian Capital</span></div>
                <div><span className="c">// → first commit in 7d · live in 42d</span></div>
              </div>
            </div>

            <div className="hero-statline" style={{ marginTop: 32, gap: 40 }}>
              <div><div className="stat-num">142</div><div className="stat-label">Shipped</div></div>
              <div><div className="stat-num">98%</div><div className="stat-label">SLA</div></div>
              <div><div className="stat-num">$2.4B</div><div className="stat-label">Volume</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroEditorial({ onCta }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-grid" style={{ opacity: 0.5 }}></div>
      </div>
      <div className="wrap hero-inner">
        <div className="hero-center fade-up">
          <div className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}><span className="dot"></span> Issue №07 — May 2026</div>
          <h1 className="h1 display-mix" style={{ marginTop: 32, fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.04em" }}>
            Software,<br/>
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 500 }} className="gradient-text">
              built like infrastructure.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 28 }}>
            Programmer Nexus is a senior engineering studio. We design, build, and operate
            production systems for fintech, health and AI-native products. No juniors, no warm bodies.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 36, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg" onClick={onCta}>
              Start a project <I.arrow style={{ width: 16, height: 16 }} />
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => window.__nav("portfolio")}>
              Read our case files
            </Btn>
          </div>
        </div>
        <div className="hero-statline fade-up fade-up-d2" style={{ justifyContent: "center", borderTop: "1px solid var(--border)", marginTop: 80 }}>
          <div><div className="stat-num">142</div><div className="stat-label">Products shipped</div></div>
          <div><div className="stat-num">$2.4B</div><div className="stat-label">Volume served</div></div>
          <div><div className="stat-num">98.4%</div><div className="stat-label">SLA retention</div></div>
          <div><div className="stat-num">12</div><div className="stat-label">Countries</div></div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// MARQUEE OF CLIENTS
// =============================================================
function Marquee() {
  const items = ["Meridian Capital", "Stellar Health", "Voltflow", "Loom Studio", "Atlas Logistics",
    "Northwind Energy", "Helix Bank", "Verde Health", "Origami Labs", "Forte Retail", "Polaris AI", "Ironbridge"];
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((t, i) => <div key={i} className="marquee-item">{t}</div>)}
      </div>
    </div>
  );
}

// =============================================================
// HOME — services + portfolio teaser + process + testimonial + CTA
// =============================================================

function ServicesSection() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot"></span> Capabilities</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              Six disciplines, <em>one team</em>,<br/>
              shipping in lockstep.
            </h2>
          </div>
          <div style={{ maxWidth: 320, color: "var(--fg-mute)", fontSize: 14 }}>
            Each engagement is staffed end-to-end. No handoffs between agencies. No translation losses.
            <div style={{ marginTop: 16 }}>
              <Btn variant="link" onClick={() => window.__nav("services")}>
                Full capability matrix <I.arrow style={{ width: 14, height: 14 }} />
              </Btn>
            </div>
          </div>
        </div>

        <div className="svc-grid">
          {SERVICES.map((s) => {
            const Ic = I[s.icon];
            return (
              <div key={s.num} className="svc-cell">
                <div className="svc-num">{s.num} ——</div>
                <div className="svc-icon">{Ic && <Ic style={{ width: 20, height: 20 }} />}</div>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
                <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PortfolioTeaser() {
  const featured = PORTFOLIO.slice(0, 3);
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot"></span> Recent work</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              Selected <em>case files</em>.
            </h2>
          </div>
          <Btn variant="ghost" onClick={() => window.__nav("portfolio")}>
            All case studies <I.arrow style={{ width: 14, height: 14 }} />
          </Btn>
        </div>

        <div className="portfolio-grid">
          {featured.map((p, i) => (
            <a key={p.id} href="#" onClick={(e) => { e.preventDefault(); window.__nav("portfolio"); }}
               className="pf-card" style={{ gridColumn: `span ${i === 0 ? 8 : 4}` }}>
              <div className="pf-thumb" style={{ background: `linear-gradient(135deg, ${p.color}26, ${p.color}06)` }}>
                <div className="pf-thumb-bg" style={{ color: `${p.color}30`, fontSize: i === 0 ? 240 : 160 }}>{p.thumb}</div>
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                  <span className="tag" style={{ background: "rgba(0,0,0,0.4)" }}>{p.industry}</span>
                  <span className="tag tag-accent">{p.status}</span>
                </div>
                <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)" }}>
                  {p.year} · {p.id}
                </div>
              </div>
              <div className="pf-meta">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.client}</span>
                  <span className="tag-accent tag">{p.metric}</span>
                </div>
                <div className="pf-title">{p.title}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { num: "i", title: "Map", body: "Two weeks of architecture interviews, code review and roadmap stress-testing. You get a written diagnosis, with or without us." },
    { num: "ii", title: "Form", body: "We assemble a squad — staff engineers, designers, ML — exactly fit to the work. No bench, no rotations." },
    { num: "iii", title: "Ship", body: "Weekly production releases. You see commits, dashboards and metrics. We stake our retainer on the SLA." },
    { num: "iv", title: "Hand over", body: "Full IP transfer, runbooks, on-call docs. We leave you with a team that can keep building without us." },
  ];
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot"></span> How we work</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              A four-step <em>operating system</em>.
            </h2>
          </div>
          <div style={{ maxWidth: 320, color: "var(--fg-mute)", fontSize: 14 }}>
            Used across 142 engagements. Same rhythm whether we're rebuilding a core banking
            system or shipping a 6-week MVP.
          </div>
        </div>
        <div className="process-list">
          {steps.map((s) => (
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

function TestimonialBlock() {
  const t = TESTIMONIALS[0];
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="eyebrow"><span className="dot"></span> Client letter №01</div>
            <div className="quote-block" style={{ marginTop: 28 }}>
              "{t.quote}"
            </div>
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>DO</div>
              <div>
                <div style={{ fontWeight: 500 }}>{t.author}</div>
                <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>{t.role}</div>
              </div>
            </div>
          </div>
          <div className="panel" style={{ padding: 32 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Outcomes — Meridian Capital
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <div className="stat-num accent-text">9 mo</div>
                <div className="stat-label">Full replatform</div>
              </div>
              <div>
                <div className="stat-num accent-text">$1.2B</div>
                <div className="stat-label">Daily volume served</div>
              </div>
              <div>
                <div className="stat-num accent-text">−68%</div>
                <div className="stat-label">P99 latency</div>
              </div>
              <div>
                <div className="stat-num accent-text">0</div>
                <div className="stat-label">Incidents in cutover</div>
              </div>
            </div>
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <Btn variant="link" onClick={() => window.__nav("portfolio")}>
                Read the full case file <I.arrow style={{ width: 14, height: 14 }} />
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)", padding: "120px 0" }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ display: "inline-flex", justifyContent: "center" }}>
          <span className="dot"></span> Let's talk
        </div>
        <h2 className="h2 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5vw, 72px)" }}>
          Have a hard <em>problem</em>?<br/>Bring it to us.
        </h2>
        <p className="lead" style={{ margin: "24px auto 0", textAlign: "center" }}>
          We respond to every inquiry within one business day. If the fit isn't right we'll tell you, and recommend someone who is.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="primary" size="lg" onClick={() => window.__nav("contact")}>
            Start a project <I.arrow style={{ width: 16, height: 16 }} />
          </Btn>
          <Btn variant="ghost" size="lg" onClick={() => window.__nav("admin")}>
            Sign in to admin <I.external style={{ width: 14, height: 14 }} />
          </Btn>
        </div>
      </div>
    </section>
  );
}

function HomePage({ heroVariant }) {
  const onCta = () => window.__nav("contact");
  return (
    <>
      {heroVariant === "animated" && <HeroAnimated onCta={onCta} />}
      {heroVariant === "split" && <HeroSplit onCta={onCta} />}
      {heroVariant === "editorial" && <HeroEditorial onCta={onCta} />}
      <Marquee />
      <ServicesSection />
      <PortfolioTeaser />
      <Process />
      <TestimonialBlock />
      <CTABand />
    </>
  );
}

Object.assign(window, { HomePage, Marquee });
