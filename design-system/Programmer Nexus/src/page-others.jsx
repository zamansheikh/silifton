/* global React, I, Btn, SERVICES, PORTFOLIO, TEAM, POSTS, CAREERS, TESTIMONIALS */
const { useState: useStateS } = React;

// =============================================================
// SERVICES PAGE
// =============================================================
function ServicesPage() {
  return (
    <div>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Services</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            What we build,<br/><em>end to end.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Six core disciplines. We staff each engagement with senior practitioners from across them — never one specialism in isolation.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
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
                  <div style={{ marginTop: 24 }}>
                    <Btn variant="link">Learn more <I.arrow style={{ width: 14, height: 14 }} /></Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Engagement models</div>
          <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
            Three ways <em>to work</em> with us.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
            {[
              { title: "Fixed-scope build", price: "from $80k", desc: "A defined product, milestone-billed. Best for greenfield builds and clear scope.", best: ["6–24 week projects", "Production handover", "Fixed milestone billing"] },
              { title: "Embedded squad", price: "from $40k/mo", featured: true, desc: "A team of senior engineers and designers, integrated into your roadmap as one cell.", best: ["3–12 month engagements", "Weekly delivery cadence", "Full source-of-truth access"] },
              { title: "Advisory retainer", price: "from $12k/mo", desc: "Senior leadership in your inbox. Architecture review, hiring, due diligence on demand.", best: ["CTO-level office hours", "Code & RFC review", "Pre-IPO / fundraise support"] },
            ].map((m) => (
              <div key={m.title} className="card card-hover" style={{ padding: 28, borderColor: m.featured ? "var(--accent)" : "var(--border)", background: m.featured ? "linear-gradient(180deg, rgba(61,220,154,0.04), transparent 60%), var(--surface-1)" : undefined }}>
                {m.featured && <span className="tag tag-accent" style={{ marginBottom: 16 }}>Most engagements</span>}
                <h3 style={{ fontSize: 22, margin: "8px 0 6px", letterSpacing: "-0.02em", fontWeight: 500 }}>{m.title}</h3>
                <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.price}</div>
                <p style={{ marginTop: 16, color: "var(--fg-mute)", fontSize: 14, lineHeight: 1.6 }}>{m.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
                  {m.best.map((b) => (
                    <li key={b} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5, color: "var(--fg-dim)" }}>
                      <I.check style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0, marginTop: 3 }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 22 }}>
                  <Btn variant={m.featured ? "primary" : "ghost"} onClick={() => window.__nav("contact")}>
                    Start a conversation <I.arrow style={{ width: 14, height: 14 }} />
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// PORTFOLIO PAGE
// =============================================================
function PortfolioPage() {
  const [filter, setFilter] = useStateS("all");
  const industries = ["all", ...new Set(PORTFOLIO.map(p => p.industry))];
  const items = filter === "all" ? PORTFOLIO : PORTFOLIO.filter(p => p.industry === filter);
  return (
    <div>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Case files</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Production work, <em>publicly logged.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            142 engagements since 2019. Below is what we're allowed to talk about. Ask about the rest under NDA.
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 40, flexWrap: "wrap" }}>
            {industries.map((i) => (
              <button key={i} onClick={() => setFilter(i)}
                className={`btn btn-sm ${filter === i ? "btn-primary" : "btn-ghost"}`}
                style={{ textTransform: i === "all" ? "capitalize" : "none" }}>
                {i === "all" ? "All sectors" : i}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="wrap">
          <div className="portfolio-grid">
            {items.map((p, idx) => (
              <a key={p.id} className="pf-card" style={{ gridColumn: `span ${idx === 0 ? 8 : 4}` }} href="#">
                <div className="pf-thumb" style={{ background: `linear-gradient(135deg, ${p.color}26, ${p.color}06)` }}>
                  <div className="pf-thumb-bg" style={{ color: `${p.color}30`, fontSize: idx === 0 ? 240 : 160 }}>{p.thumb}</div>
                  <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                    <span className="tag" style={{ background: "rgba(0,0,0,0.4)" }}>{p.industry}</span>
                    <span className="tag tag-accent">{p.metric}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)" }}>
                    {p.year} · {p.id}
                  </div>
                </div>
                <div className="pf-meta">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.client}</span>
                  <div className="pf-title">{p.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, color: "var(--accent)", fontSize: 13 }}>
                    <span>Read case file</span>
                    <I.arrow style={{ width: 14, height: 14 }} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// ABOUT / CULTURE PAGE
// =============================================================
function AboutPage() {
  return (
    <div>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> About</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            <span style={{ display: "block", maxWidth: "18ch" }}>
              A studio of <em>operators</em>, not consultants.
            </span>
          </h1>
        </div>
      </section>

      <section style={{ padding: "40px 0 100px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-dim)" }}>
              <span className="serif" style={{ fontSize: 64, lineHeight: 0.8, float: "left", marginRight: 12, marginTop: 6, color: "var(--accent)" }}>P</span>
              rogrammer Nexus was founded in 2019 by engineers who'd led platform teams
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
              <div className="eyebrow"><span className="dot"></span> Operating principles</div>
              <div style={{ marginTop: 24 }}>
                {[
                  ["Senior only", "Every commit is by someone with 8+ years in production."],
                  ["Production or it didn't happen", "We don't ship demos, prototypes or proofs."],
                  ["One squad, one mission", "No matrixed teams. No shared resources."],
                  ["Write it down", "Every decision in an RFC. Every system in a runbook."],
                  ["Stay until the metric moves", "We define success in numbers before we start."],
                ].map(([k, v], i) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, padding: "16px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
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
              <div className="eyebrow"><span className="dot"></span> Leadership</div>
              <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
                The people <em>accountable</em>.
              </h2>
            </div>
            <Btn variant="ghost" onClick={() => window.__nav("careers")}>
              See open roles <I.arrow style={{ width: 14, height: 14 }} />
            </Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TEAM.map((t) => (
              <div key={t.name} className="card card-hover" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{t.initials}</div>
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
              <div className="eyebrow"><span className="dot"></span> By the numbers</div>
              <h2 className="h2 display-mix" style={{ marginTop: 16 }}>Programmer Nexus, <em>in figures</em>.</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              ["38", "People worldwide"],
              ["3.4 yr", "Avg. engagement"],
              ["142", "Products shipped"],
              ["98%", "Client retention"],
              ["$2.4B", "Customer volume served"],
              ["18", "Industries served"],
              ["0", "Junior engineers"],
              ["7 d", "Avg. time to first commit"],
            ].map(([n, l]) => (
              <div key={l} className="panel" style={{ padding: 28 }}>
                <div className="stat-num gradient-text">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// CAREERS PAGE
// =============================================================
function CareersPage() {
  const [t, setT] = useStateS("Engineering");
  const teams = ["Engineering", "Design", "AI", "Operations"];
  return (
    <div>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Careers</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Join a team of <em>senior-only</em><br/>practitioners.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We hire ~6 people per year. We pay top of band, anywhere you live, and we promote on merit alone.
          </p>
        </div>
      </section>

      <section style={{ padding: "20px 0 100px" }}>
        <div className="wrap">
          <div className="panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <h3 className="h3">Open roles · {CAREERS.filter(c => c.status === "Open").length}</h3>
              <div style={{ display: "flex", gap: 6 }}>
                {teams.map((tt) => (
                  <button key={tt} className={`btn btn-sm ${t === tt ? "btn-primary" : "btn-ghost"}`} onClick={() => setT(tt)}>{tt}</button>
                ))}
              </div>
            </div>
            {CAREERS.filter(c => c.status === "Open").map((j) => (
              <div key={j.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 24, padding: "20px 0", borderTop: "1px solid var(--border)", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 16 }}>{j.title}</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 13, marginTop: 4 }}>{j.team} · {j.level}</div>
                </div>
                <div style={{ color: "var(--fg-dim)", fontSize: 13.5 }}>{j.location}</div>
                <div style={{ color: "var(--fg-dim)", fontSize: 13.5 }}>{j.type}</div>
                <div className="mono" style={{ color: "var(--fg-faint)", fontSize: 12 }}>Posted {j.posted}</div>
                <Btn variant="ghost" size="sm">Apply <I.arrow style={{ width: 12, height: 12 }} /></Btn>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              ["Top-of-band pay", "We pay the 90th-percentile salary for your role and tenure, anywhere you live."],
              ["6-week onboarding", "Paired with a senior engineer. You ship to production in week three."],
              ["Sabbatical at 5 yr", "Three paid months. No expectation to return with a deliverable."],
              ["Conference budget", "$5,000/yr to attend, speak at, or run a conference of your choosing."],
              ["Quarterly offsite", "Four times a year, in cities the team votes on. Family welcome."],
              ["Equity from day one", "Real equity, in cash-flowing entity. Vests over 4 years."],
            ].map(([k, v]) => (
              <div key={k} className="card">
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{k}</h4>
                <p style={{ color: "var(--fg-mute)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// BLOG PAGE
// =============================================================
function BlogPage() {
  return (
    <div>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Writing</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Field notes <em>from production.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We publish what we learn. No content marketing, no listicles — just the engineering writeups we'd want to read.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="wrap">
          {/* Featured */}
          {(() => {
            const f = POSTS[0];
            return (
              <a href="#" className="pf-card" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", marginBottom: 32 }}>
                <div className="pf-thumb" style={{ background: "linear-gradient(135deg, rgba(61,220,154,0.18), rgba(79,123,230,0.1))", aspectRatio: "auto" }}>
                  <div className="pf-thumb-bg" style={{ color: "rgba(61,220,154,0.25)", fontSize: 280 }}>{f.title.charAt(0)}</div>
                  <div style={{ position: "absolute", top: 20, left: 20 }}>
                    <span className="tag tag-accent">Featured · {f.category}</span>
                  </div>
                </div>
                <div className="pf-meta" style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {f.date} · {f.read} read
                  </div>
                  <h2 className="h3" style={{ marginTop: 16, fontSize: 28, lineHeight: 1.15 }}>{f.title}</h2>
                  <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{f.author.split(" ").map(x => x[0]).join("")}</div>
                    <div style={{ fontSize: 13.5, color: "var(--fg-dim)" }}>{f.author}</div>
                  </div>
                </div>
              </a>
            );
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {POSTS.slice(1).filter(p => p.status === "Published").map((p) => (
              <a key={p.id} href="#" className="pf-card">
                <div className="pf-thumb" style={{ background: "linear-gradient(135deg, var(--surface-2), var(--surface-0))", aspectRatio: "16/9" }}>
                  <div className="pf-thumb-bg" style={{ color: "rgba(255,255,255,0.08)" }}>{p.title.charAt(0)}</div>
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <span className="tag">{p.category}</span>
                  </div>
                </div>
                <div className="pf-meta">
                  <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {p.date} · {p.read}
                  </div>
                  <h3 className="pf-title" style={{ fontSize: 17 }}>{p.title}</h3>
                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--fg-mute)" }}>{p.author}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// CONTACT PAGE
// =============================================================
function ContactPage() {
  const [form, setForm] = useStateS({ name: "", company: "", email: "", budget: "$100k–$250k", message: "" });
  const [sent, setSent] = useStateS(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span> Contact</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Tell us about<br/><em>the problem.</em>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "start" }}>
          <div className="panel" style={{ padding: 40 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(61,220,154,0.12)", border: "1px solid var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--accent)" }}>
                  <I.check style={{ width: 24, height: 24 }} />
                </div>
                <h3 className="h3">Thanks — we'll be in touch within one business day.</h3>
                <p style={{ color: "var(--fg-mute)", marginTop: 12 }}>Inquiry routed to: <span className="mono">partners@programmernexus.com</span></p>
                <Btn variant="ghost" onClick={() => setSent(false)} style={{ marginTop: 24 }}>Send another</Btn>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="field"><label>Your name</label><input className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Daniel Okafor" required /></div>
                  <div className="field"><label>Company</label><input className="input" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} placeholder="Meridian Capital" required /></div>
                  <div className="field" style={{ gridColumn: "span 2" }}><label>Work email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@company.com" required /></div>
                  <div className="field" style={{ gridColumn: "span 2" }}><label>Estimated budget</label>
                    <select className="select" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})}>
                      <option>$50k–$100k</option><option>$100k–$250k</option><option>$250k–$500k</option><option>$500k+</option><option>Not sure yet</option>
                    </select>
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}><label>What are you trying to ship?</label>
                    <textarea className="textarea" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="A few sentences are enough. Links to RFCs welcome." required></textarea>
                  </div>
                </div>
                <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>Avg. response time: <span className="accent-text">4h 12m</span></div>
                  <Btn variant="primary" type="submit">Send inquiry <I.arrow style={{ width: 14, height: 14 }} /></Btn>
                </div>
              </form>
            )}
          </div>

          <div>
            <h3 className="h3" style={{ fontSize: 18 }}>Direct lines</h3>
            <div style={{ marginTop: 20 }}>
              {[
                ["Partnerships & RFPs", "partners@programmernexus.com"],
                ["Careers", "hello@programmernexus.com"],
                ["Press", "press@programmernexus.com"],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                  <div style={{ marginTop: 4, fontSize: 14.5 }}>{v}</div>
                </div>
              ))}
            </div>

            <h3 className="h3" style={{ fontSize: 18, marginTop: 40 }}>Offices</h3>
            <div style={{ marginTop: 20 }}>
              {[
                ["Dhaka", "House 14, Road 27, Banani · GMT+6"],
                ["London", "Borough Yards, SE1 1RU · GMT+0"],
                ["Lagos", "Akin Adesola, Victoria Island · GMT+1"],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 500 }}>{k}</div>
                  <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--fg-mute)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ServicesPage, PortfolioPage, AboutPage, CareersPage, BlogPage, ContactPage });
