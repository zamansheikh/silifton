/* global React, I, Btn, StatusPill,
   SERVICES, PORTFOLIO, TEAM, POSTS, CAREERS, INQUIRIES, APPLICATIONS,
   TESTIMONIALS, USERS */
const { useState: useAS } = React;

// =============================================================
// Reusable filter bar
// =============================================================
function AdminToolbar({ count, label, search, onSearch, filters, onAction, actionLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--fg-mute)" }}>
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>{count}</span> {label}
        </span>
        <span style={{ width: 1, height: 18, background: "var(--border)" }}></span>
        <div className="admin-search" style={{ width: 280 }}>
          <I.search style={{ width: 13, height: 13 }} />
          <input value={search} onChange={(e) => onSearch && onSearch(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`} />
        </div>
        {filters && filters.map((f, i) => (
          <select key={i} className="select" style={{ width: 140, padding: "8px 10px", fontSize: 13 }} defaultValue={f.value}>
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="ghost" size="sm"><I.filter style={{ width: 13, height: 13 }} /> Filters</Btn>
        <Btn variant="ghost" size="sm"><I.download style={{ width: 13, height: 13 }} /> Export</Btn>
        {onAction && <Btn variant="primary" size="sm" onClick={onAction}><I.plus style={{ width: 13, height: 13 }} /> {actionLabel}</Btn>}
      </div>
    </div>
  );
}

function PageHead({ title, sub, action, actionLabel }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {action && <Btn variant="primary" onClick={action}><I.plus style={{ width: 14, height: 14 }} /> {actionLabel}</Btn>}
    </div>
  );
}

// =============================================================
// SERVICES (admin)
// =============================================================
function ServicesAdmin() {
  const [q, setQ] = useAS("");
  return (
    <>
      <PageHead title="Services" sub="The six capabilities shown on the marketing site." action={() => {}} actionLabel="New service" />
      <AdminToolbar count={SERVICES.length} label="services" search={q} onSearch={setQ} actionLabel="New service" onAction={() => {}} />
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>Order</th><th>Service</th><th>Tags</th><th>Status</th><th>Last edited</th><th></th></tr></thead>
          <tbody>
            {SERVICES.map((s) => {
              const Ic = I[s.icon];
              return (
                <tr key={s.num}>
                  <td className="row-id">{s.num}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--accent)" }}>
                        {Ic && <Ic style={{ width: 16, height: 16 }} />}
                      </div>
                      <div>
                        <div className="cell-title">{s.title}</div>
                        <div style={{ color: "var(--fg-mute)", fontSize: 12, maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {s.tags.slice(0, 3).map((t) => <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>)}
                    </div>
                  </td>
                  <td><StatusPill status="Published" /></td>
                  <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>2d ago · Zaman S.</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="View"><I.eye /></button>
                      <button className="icon-btn" title="Edit"><I.edit /></button>
                      <button className="icon-btn danger" title="Delete"><I.trash /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============================================================
// PORTFOLIO (admin)
// =============================================================
function PortfolioAdmin() {
  const [q, setQ] = useAS("");
  return (
    <>
      <PageHead title="Portfolio & case studies" sub="Case files shown publicly. Drafts won't appear on the site." />
      <AdminToolbar count={PORTFOLIO.length} label="case studies" search={q} onSearch={setQ}
        filters={[{ value: "All sectors", options: ["All sectors", "Fintech", "Healthtech", "Energy", "Media"] }]}
        actionLabel="New case study" onAction={() => {}} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {PORTFOLIO.map((p) => (
          <div key={p.id} className="card card-hover" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ aspectRatio: "16/10", position: "relative", background: `linear-gradient(135deg, ${p.color}26, ${p.color}06)` }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 120, color: `${p.color}30` }}>{p.thumb}</div>
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                <span className="tag" style={{ background: "rgba(0,0,0,0.4)" }}>{p.industry}</span>
                <StatusPill status="Published" />
              </div>
              <div style={{ position: "absolute", bottom: 10, right: 12, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-mute)" }}>{p.id}</div>
            </div>
            <div style={{ padding: 16 }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.client}</div>
              <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="tag-accent tag">{p.metric}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="icon-btn" title="View"><I.eye /></button>
                  <button className="icon-btn" title="Edit"><I.edit /></button>
                  <button className="icon-btn danger" title="Delete"><I.trash /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* New tile */}
        <div className="card" style={{ display: "grid", placeItems: "center", border: "1.5px dashed var(--border-strong)", background: "transparent", minHeight: 280, cursor: "pointer", color: "var(--fg-mute)" }}>
          <div style={{ textAlign: "center" }}>
            <I.plus style={{ width: 24, height: 24, marginBottom: 8 }} />
            <div style={{ fontWeight: 500 }}>Add case study</div>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================
// BLOG (admin)
// =============================================================
function BlogAdmin() {
  const [q, setQ] = useAS("");
  return (
    <>
      <PageHead title="Blog posts" sub="24 published, 3 drafts, 0 scheduled" />
      <AdminToolbar count={POSTS.length} label="posts" search={q} onSearch={setQ}
        filters={[
          { value: "All categories", options: ["All categories", "Engineering", "Design", "Culture", "Operations"] },
          { value: "All statuses", options: ["All statuses", "Published", "Draft", "Scheduled"] },
        ]}
        actionLabel="New post" onAction={() => {}} />
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th><input type="checkbox" /></th><th>Title</th><th>Author</th><th>Category</th><th>Views</th><th>Status</th><th>Published</th><th></th></tr></thead>
          <tbody>
            {POSTS.map((p) => (
              <tr key={p.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="cell-title" style={{ maxWidth: 380 }}>{p.title}</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 12, marginTop: 2 }}>{p.read} read · {p.id}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ width: 26, height: 26, fontSize: 11 }}>{p.author.split(" ").map(x => x[0]).join("")}</div>
                    <span style={{ fontSize: 13 }}>{p.author}</span>
                  </div>
                </td>
                <td><span className="tag">{p.category}</span></td>
                <td className="mono" style={{ fontSize: 12.5 }}>{p.views ? p.views.toLocaleString() : "—"}</td>
                <td><StatusPill status={p.status} /></td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{p.date}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn"><I.eye /></button>
                    <button className="icon-btn"><I.edit /></button>
                    <button className="icon-btn danger"><I.trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============================================================
// TESTIMONIALS (admin)
// =============================================================
function TestimonialsAdmin() {
  return (
    <>
      <PageHead title="Testimonials" sub="What clients say about us. Featured testimonials appear on the homepage." />
      <AdminToolbar count={TESTIMONIALS.length} label="testimonials" search="" onSearch={() => {}} actionLabel="New testimonial" onAction={() => {}} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="card" style={{ position: "relative" }}>
            {t.featured && <span className="tag tag-accent" style={{ position: "absolute", top: 16, right: 16 }}><I.star style={{ width: 11, height: 11 }} /> Featured</span>}
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.3, color: "var(--fg)", paddingRight: t.featured ? 80 : 0 }}>"{t.quote}"</div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{t.author.split(" ").map(x => x[0]).join("")}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{t.author}</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{t.role}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="icon-btn"><I.edit /></button>
                <button className="icon-btn danger"><I.trash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// =============================================================
// SITE SETTINGS (hero, about copy, etc.)
// =============================================================
function SiteSettingsAdmin() {
  const [tab, setTab] = useAS("hero");
  const [hero, setHero] = useAS({
    headline: "We build the software serious teams stake their roadmap on.",
    sub: "A senior-only engineering studio for fintech, health, and AI-native products.",
    cta: "Start a project",
    showStats: true,
    showMarquee: true,
  });
  return (
    <>
      <PageHead title="Site settings" sub="Edit the content shown on the public website. Changes are live in 30 seconds." />
      <div className="tabs">
        {["hero", "about", "footer", "social", "seo"].map((t) => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>
      {tab === "hero" && (
        <div className="two-col">
          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Hero section</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="field"><label>Eyebrow text</label><input className="input" defaultValue="Programmer Nexus / Engineered software" /></div>
              <div className="field"><label>Headline</label><textarea className="textarea" style={{ minHeight: 90 }} value={hero.headline} onChange={(e) => setHero({...hero, headline: e.target.value})}></textarea></div>
              <div className="field"><label>Subheading</label><textarea className="textarea" value={hero.sub} onChange={(e) => setHero({...hero, sub: e.target.value})}></textarea></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field"><label>Primary CTA</label><input className="input" value={hero.cta} onChange={(e) => setHero({...hero, cta: e.target.value})} /></div>
                <div className="field"><label>Secondary CTA</label><input className="input" defaultValue="See selected work" /></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                <div><div style={{ fontWeight: 500, fontSize: 14 }}>Show statistics</div><div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>4 key numbers under hero</div></div>
                <div className={`toggle ${hero.showStats ? "on" : ""}`} onClick={() => setHero({...hero, showStats: !hero.showStats})}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                <div><div style={{ fontWeight: 500, fontSize: 14 }}>Show client marquee</div><div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>Scrolling list of client names</div></div>
                <div className={`toggle ${hero.showMarquee ? "on" : ""}`} onClick={() => setHero({...hero, showMarquee: !hero.showMarquee})}></div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Btn variant="primary" size="sm">Save changes</Btn>
                <Btn variant="ghost" size="sm">Preview on site</Btn>
              </div>
            </div>
          </div>
          <div>
            <div className="panel" style={{ padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Live preview</div>
              <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, minHeight: 280 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Programmer Nexus / Engineered software</div>
                <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{hero.headline}</div>
                <div style={{ color: "var(--fg-mute)", fontSize: 13.5, marginTop: 14, lineHeight: 1.5 }}>{hero.sub}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <span className="btn btn-primary btn-sm">{hero.cta}</span>
                  <span className="btn btn-ghost btn-sm">See selected work</span>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: 20, marginTop: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Editor activity</div>
              <div style={{ fontSize: 13 }}>
                <div className="activity-item"><div className="activity-dot"></div><div><div>Last edit by <strong>Mehedi H.</strong></div><div className="activity-meta">3h ago — "Engineered for production..."</div></div></div>
                <div className="activity-item"><div className="activity-dot" style={{ background: "var(--info)" }}></div><div><div>Version restored by <strong>Zaman S.</strong></div><div className="activity-meta">Yesterday</div></div></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab !== "hero" && (
        <div className="panel" style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>
          <div style={{ fontSize: 14 }}>The <span style={{ color: "var(--fg)", fontWeight: 500 }}>{tab}</span> editor would live here.</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Hero tab is fully wired in this prototype.</div>
        </div>
      )}
    </>
  );
}

// =============================================================
// TEAM (admin)
// =============================================================
function TeamAdmin() {
  const expandedTeam = [
    ...TEAM,
    { name: "Asif Mahmud", role: "Staff Engineer", initials: "AM", focus: "Platform" },
    { name: "Reem Hassan", role: "Senior Designer", initials: "RH", focus: "Brand" },
    { name: "Liu Wei", role: "ML Engineer", initials: "LW", focus: "Evals" },
    { name: "Olu Adekoya", role: "Senior Engineer", initials: "OA", focus: "Mobile" },
    { name: "Camille Roux", role: "Engineering Lead", initials: "CR", focus: "Backend" },
    { name: "Joon-ho Park", role: "Staff Engineer", initials: "JP", focus: "AI" },
  ];
  return (
    <>
      <PageHead title="Team members" sub="38 people across Dhaka, London and Lagos. Public team page shows leadership only." />
      <AdminToolbar count={expandedTeam.length} label="team members" search="" onSearch={() => {}}
        filters={[
          { value: "All offices", options: ["All offices", "Dhaka", "London", "Lagos", "Remote"] },
          { value: "All teams", options: ["All teams", "Engineering", "Design", "AI", "Operations"] },
        ]}
        actionLabel="Add member" onAction={() => {}} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {expandedTeam.map((p, i) => (
          <div key={p.name} className="card card-hover" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{p.initials}</div>
              {i < 6 && <span className="tag tag-accent" style={{ fontSize: 10 }}>Public</span>}
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 500 }}>{p.name}</div>
              <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{p.role}</div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{p.focus}</span>
              <div style={{ display: "flex", gap: 2 }}>
                <button className="icon-btn"><I.edit /></button>
                <button className="icon-btn danger"><I.trash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// =============================================================
// CAREERS (admin)
// =============================================================
function CareersAdmin() {
  return (
    <>
      <PageHead title="Job openings" sub="5 open · 1 closed · 47 active applications" />
      <AdminToolbar count={CAREERS.length} label="job openings" search="" onSearch={() => {}}
        filters={[{ value: "All teams", options: ["All teams", "Platform", "Product", "AI", "Design", "Mobile", "Marketing"] }]}
        actionLabel="Post new role" onAction={() => {}} />
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>ID</th><th>Role</th><th>Team</th><th>Location</th><th>Type</th><th>Status</th><th>Applicants</th><th>Posted</th><th></th></tr></thead>
          <tbody>
            {CAREERS.map((j) => (
              <tr key={j.id}>
                <td className="row-id">{j.id}</td>
                <td>
                  <div className="cell-title">{j.title}</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{j.level}</div>
                </td>
                <td><span className="tag">{j.team}</span></td>
                <td style={{ color: "var(--fg-dim)", fontSize: 13 }}>{j.location}</td>
                <td style={{ color: "var(--fg-dim)" }}>{j.type}</td>
                <td><StatusPill status={j.status} /></td>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    <I.users style={{ width: 12, height: 12, color: "var(--fg-mute)" }} />
                    {j.applicants}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{j.posted}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn"><I.eye /></button>
                    <button className="icon-btn"><I.edit /></button>
                    <button className="icon-btn danger"><I.trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============================================================
// APPLICATIONS (admin)
// =============================================================
function ApplicationsAdmin() {
  const stages = ["Applied", "Tech screen", "Portfolio review", "Hiring manager", "Onsite", "Offer"];
  const stageCounts = { "Applied": 18, "Tech screen": 11, "Portfolio review": 6, "Hiring manager": 5, "Onsite": 4, "Offer": 3 };
  return (
    <>
      <PageHead title="Applications" sub="47 active candidates across the funnel" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
        {stages.map((s, i) => (
          <div key={s} className="card" style={{ padding: 16, borderColor: i === 0 ? "var(--accent)" : "var(--border)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Stage {i + 1}</div>
            <div style={{ fontWeight: 500, marginTop: 4, fontSize: 14 }}>{s}</div>
            <div style={{ fontSize: 26, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>{stageCounts[s]}</div>
          </div>
        ))}
      </div>

      <AdminToolbar count={APPLICATIONS.length} label="applications" search="" onSearch={() => {}}
        filters={[
          { value: "All stages", options: ["All stages", ...stages, "Rejected"] },
          { value: "All roles", options: ["All roles", ...new Set(APPLICATIONS.map(a => a.role))] },
        ]}
        actionLabel="" />
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>ID</th><th>Candidate</th><th>Applied for</th><th>Stage</th><th>Score</th><th>Source</th><th>Applied</th><th></th></tr></thead>
          <tbody>
            {APPLICATIONS.map((a) => (
              <tr key={a.id}>
                <td className="row-id">{a.id}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{a.candidate.split(" ").map(x => x[0]).join("")}</div>
                    <span className="cell-title">{a.candidate}</span>
                  </div>
                </td>
                <td style={{ color: "var(--fg-dim)" }}>{a.role}</td>
                <td><StatusPill status={a.stage} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${a.score}%`, height: "100%", background: a.score > 85 ? "var(--accent)" : a.score > 70 ? "var(--info)" : "var(--warn)" }}></div>
                    </div>
                    <span className="mono" style={{ fontSize: 12.5, color: a.score > 85 ? "var(--accent)" : "var(--fg-dim)" }}>{a.score}</span>
                  </div>
                </td>
                <td style={{ color: "var(--fg-mute)", fontSize: 13 }}>{a.source}</td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{a.date}</td>
                <td><button className="icon-btn"><I.chevron /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============================================================
// INQUIRIES (admin)
// =============================================================
function InquiriesAdmin() {
  const [selected, setSelected] = useAS(INQUIRIES[0]);
  return (
    <>
      <PageHead title="Contact inquiries" sub="2 new · 5 awaiting reply · avg. response 4h 12m" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
          <table className="dt">
            <thead><tr><th>ID</th><th>From</th><th>Subject</th><th>Budget</th><th>Status</th><th>Priority</th><th>Received</th></tr></thead>
            <tbody>
              {INQUIRIES.map((q) => (
                <tr key={q.id} onClick={() => setSelected(q)} style={{ cursor: "pointer", background: selected.id === q.id ? "var(--surface-2)" : undefined }}>
                  <td className="row-id">{q.id}</td>
                  <td>
                    <div className="cell-title">{q.name}</div>
                    <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{q.company}</div>
                  </td>
                  <td style={{ color: "var(--fg-dim)" }}>{q.subject}</td>
                  <td><span className="tag">{q.budget}</span></td>
                  <td><StatusPill status={q.status} /></td>
                  <td>
                    <span className={`tag ${q.priority === "Critical" ? "tag-danger" : q.priority === "High" ? "tag-warn" : "tag"}`}>{q.priority}</span>
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{q.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel" style={{ padding: 24, position: "sticky", top: 84, alignSelf: "start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="row-id">{selected.id}</div>
              <h3 style={{ margin: "6px 0 4px", fontSize: 18, fontWeight: 500 }}>{selected.name}</h3>
              <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>{selected.company}</div>
            </div>
            <StatusPill status={selected.status} />
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            {[
              ["Email", selected.email],
              ["Budget", selected.budget],
              ["Priority", selected.priority],
              ["Received", selected.date],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", padding: "8px 0", fontSize: 13 }}>
                <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</span>
                <span style={{ color: "var(--fg-dim)" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Message</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-dim)" }}>{selected.subject}. We're a fast-growing organisation and would like to explore an engagement. We have a 12-month timeline and budget in the {selected.budget} range. Looking forward to hearing back.</div>
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            <Btn variant="primary" size="sm">Reply</Btn>
            <Btn variant="ghost" size="sm">Move to CRM</Btn>
            <button className="icon-btn" title="Archive"><I.trash /></button>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================
// USERS & ROLES
// =============================================================
function UsersAdmin() {
  const roleColors = { Owner: "tag-accent", Admin: "tag-info", Editor: "tag", Author: "tag", Viewer: "tag" };
  return (
    <>
      <PageHead title="Users & roles" sub="6 active members · 4 roles · SSO via Google Workspace" />
      <AdminToolbar count={USERS.length} label="users" search="" onSearch={() => {}}
        filters={[{ value: "All roles", options: ["All roles", "Owner", "Admin", "Editor", "Author", "Viewer"] }]}
        actionLabel="Invite user" onAction={() => {}} />

      <div className="panel" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        <table className="dt">
          <thead><tr><th><input type="checkbox" /></th><th>User</th><th>Role</th><th>Last active</th><th>2FA</th><th></th></tr></thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{u.initials}</div>
                    <div>
                      <div className="cell-title">{u.name} {u.you && <span className="tag" style={{ fontSize: 10, marginLeft: 6 }}>You</span>}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`tag ${roleColors[u.role] || "tag"}`}>{u.role}</span></td>
                <td className="mono" style={{ fontSize: 12, color: "var(--fg-faint)" }}>{u.lastActive}</td>
                <td><span className="tag tag-accent"><I.check style={{ width: 10, height: 10 }} /> Enabled</span></td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn"><I.edit /></button>
                    <button className="icon-btn danger"><I.trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ margin: "32px 0 16px", fontSize: 16, fontWeight: 500 }}>Roles & permissions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { name: "Owner", color: "var(--accent)", perms: ["Full access", "Billing", "Delete workspace", "Manage roles"] },
          { name: "Admin", color: "var(--info)", perms: ["Edit everything", "Manage users", "API keys", "No billing"] },
          { name: "Editor", color: "#C792EA", perms: ["Edit content", "Publish posts", "View inquiries", "No users/settings"] },
          { name: "Viewer", color: "var(--fg-mute)", perms: ["Read-only access", "Export reports", "No edit rights", "No inbox"] },
        ].map((r) => (
          <div key={r.name} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${r.color}20`, border: `1px solid ${r.color}40`, display: "grid", placeItems: "center" }}>
                <I.shield style={{ width: 14, height: 14, color: r.color }} />
              </div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{r.name}</h4>
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
              {r.perms.map((p) => (
                <li key={p} style={{ display: "flex", gap: 8, padding: "6px 0", fontSize: 12.5, color: "var(--fg-dim)" }}>
                  <I.check style={{ width: 12, height: 12, color: r.color, flexShrink: 0, marginTop: 3 }} /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

// =============================================================
// WORKSPACE SETTINGS
// =============================================================
function SettingsAdmin() {
  const [tab, setTab] = useAS("workspace");
  return (
    <>
      <PageHead title="Workspace settings" sub="Configure your admin workspace, integrations and security" />
      <div className="tabs">
        {["workspace", "billing", "integrations", "api keys", "security", "danger"].map((t) => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.replace(/\b\w/g, c => c.toUpperCase())}</div>
        ))}
      </div>

      {tab === "workspace" && (
        <div className="two-col">
          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>General</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field"><label>Workspace name</label><input className="input" defaultValue="Programmer Nexus" /></div>
              <div className="field"><label>Public domain</label><input className="input" defaultValue="programmernexus.com" /></div>
              <div className="field"><label>Admin domain</label><input className="input" defaultValue="admin.programmernexus.com" /></div>
              <div className="field"><label>Default timezone</label><select className="select"><option>GMT+6 — Dhaka</option><option>GMT+0 — London</option><option>GMT-5 — New York</option></select></div>
              <Btn variant="primary" size="sm">Save changes</Btn>
            </div>
          </div>
          <div>
            <div className="panel" style={{ padding: 28, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 500 }}>Plan</h3>
              <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>You're on the <span style={{ color: "var(--accent)" }}>Enterprise</span> plan</div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["10 / 25", "Editors"], ["48 / 100GB", "Storage"], ["8.2M / 10M", "API calls"], ["∞", "Workspaces"]].map(([v, k]) => (
                  <div key={k} style={{ padding: 12, background: "var(--surface-2)", borderRadius: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{v}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-faint)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Public site status</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>Toggle the site offline for maintenance</div>
                </div>
                <div className="toggle on"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab !== "workspace" && (
        <div className="panel" style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>
          <div style={{ fontSize: 14 }}>The <span style={{ color: "var(--fg)", fontWeight: 500 }}>{tab}</span> tab is wired in production builds.</div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { ServicesAdmin, PortfolioAdmin, BlogAdmin, TestimonialsAdmin, SiteSettingsAdmin, TeamAdmin, CareersAdmin, ApplicationsAdmin, InquiriesAdmin, UsersAdmin, SettingsAdmin });
