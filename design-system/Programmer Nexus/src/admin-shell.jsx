/* global React, I, Btn, Sparkline, AreaChart, BarChart, Donut,
   SERVICES, PORTFOLIO, TEAM, POSTS, CAREERS, INQUIRIES, APPLICATIONS,
   TESTIMONIALS, USERS, ACTIVITY, KPI_VISITORS, KPI_INQUIRIES, KPI_REVENUE, KPI_HIRES, MONTHS, SOURCES */
const { useState: useAdminState } = React;

// =============================================================
// ADMIN SHELL
// =============================================================

function AdminShell({ section, setSection, children, logo }) {
  const groups = [
    {
      label: "Workspace",
      items: [
        { id: "overview", label: "Overview", icon: "home" },
        { id: "analytics", label: "Analytics", icon: "chart" },
      ],
    },
    {
      label: "Content",
      items: [
        { id: "services", label: "Services", icon: "bolt", count: 6 },
        { id: "portfolio", label: "Portfolio", icon: "layers", count: 18 },
        { id: "blog", label: "Blog posts", icon: "fileText", count: 24 },
        { id: "testimonials", label: "Testimonials", icon: "star", count: 12 },
        { id: "site", label: "Site settings", icon: "globe" },
      ],
    },
    {
      label: "People",
      items: [
        { id: "team", label: "Team", icon: "users", count: 38 },
        { id: "careers", label: "Job openings", icon: "briefcase", count: 5 },
        { id: "applications", label: "Applications", icon: "fileText", count: 47, badge: "live" },
      ],
    },
    {
      label: "Inbox",
      items: [
        { id: "inquiries", label: "Inquiries", icon: "mail", count: 7, badge: "live" },
      ],
    },
    {
      label: "System",
      items: [
        { id: "users", label: "Users & roles", icon: "shield" },
        { id: "settings", label: "Workspace settings", icon: "settings" },
      ],
    },
  ];

  const currentLabel = groups.flatMap(g => g.items).find(i => i.id === section)?.label || "Overview";

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="side-brand">
          <img src={logo} alt="PN" />
          <div>
            <div className="side-brand-name">Programmer Nexus</div>
            <div style={{ fontSize: 11, color: "var(--fg-faint)" }}>Admin · v2.4</div>
          </div>
          <div className="side-brand-mark">PN</div>
        </div>

        {groups.map((g) => (
          <div key={g.label} className="side-group">
            <div className="side-group-label">{g.label}</div>
            {g.items.map((it) => {
              const Ic = I[it.icon];
              const active = section === it.id;
              return (
                <div key={it.id} className={`side-item ${active ? "active" : ""}`} onClick={() => setSection(it.id)}>
                  {Ic && <Ic />}
                  <span>{it.label}</span>
                  {it.count !== undefined && (
                    <span className={`side-badge ${it.badge === "live" ? "live" : ""}`}>{it.count}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 24, padding: 14, background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px rgba(61,220,154,0.2)" }}></div>
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>All systems normal</span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--fg-mute)", fontFamily: "var(--font-mono)" }}>API 12ms · DB 4ms · CDN ✓</div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-crumbs">
            <span>Admin</span><I.chevron style={{ width: 12, height: 12, color: "var(--fg-faint)" }} /><span className="now">{currentLabel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="admin-search">
              <I.search style={{ width: 14, height: 14 }} />
              <input placeholder="Search anything — posts, people, inquiries…" />
              <kbd>⌘K</kbd>
            </div>
            <button className="icon-btn" style={{ width: 36, height: 36 }} title="View site" onClick={() => window.__nav("home")}>
              <I.external style={{ width: 16, height: 16 }} />
            </button>
            <button className="icon-btn" style={{ width: 36, height: 36, position: "relative" }} title="Notifications">
              <I.bell style={{ width: 16, height: 16 }} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "var(--accent)", borderRadius: "50%" }}></span>
            </button>
            <div className="admin-user">
              <div className="avatar">ZS</div>
            </div>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

// =============================================================
// OVERVIEW
// =============================================================

function OverviewPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome back, Zaman.</h1>
          <p className="page-sub">Tuesday, May 17, 2026 · You have <span style={{ color: "var(--accent)" }}>2 new inquiries</span> and 3 applications to review.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" size="sm"><I.download style={{ width: 14, height: 14 }} /> Export report</Btn>
          <Btn variant="primary" size="sm"><I.plus style={{ width: 14, height: 14 }} /> Quick action</Btn>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "Visitors / mo", val: "118K", trend: "+15.2%", spark: KPI_VISITORS, color: "var(--accent)" },
          { label: "Inquiries", val: "42", trend: "+20.0%", spark: KPI_INQUIRIES, color: "#4F7BE6" },
          { label: "Revenue (MRR)", val: "$640K", trend: "+8.5%", spark: KPI_REVENUE, color: "#F5A524" },
          { label: "Open positions", val: "5", trend: "+2", spark: KPI_HIRES, color: "#C792EA" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{k.val}</div>
            <span className="kpi-trend"><I.arrow style={{ width: 10, height: 10, transform: "rotate(-45deg)" }} /> {k.trend}</span>
            <div className="kpi-spark"><Sparkline values={k.spark} color={k.color} h={36} w={240} /></div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Site performance — 12 months</h3>
              <div style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 4 }}>Visitors and inquiries trend</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-dim)" }}>
                <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: 2 }}></span> Visitors (k)
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-dim)" }}>
                <span style={{ width: 8, height: 8, background: "#4F7BE6", borderRadius: 2 }}></span> Inquiries
              </span>
            </div>
          </div>
          <AreaChart
            series={[
              { values: KPI_VISITORS, color: "var(--accent)" },
              { values: KPI_INQUIRIES.map(v => v * 2.6), color: "#4F7BE6" },
            ]}
            labels={MONTHS}
            height={260}
          />
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Traffic sources</h3>
          <div style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 4 }}>Last 30 days · 118,420 sessions</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
            <div style={{ position: "relative" }}>
              <Donut data={SOURCES} size={180} />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 500 }}>118K</div>
                  <div style={{ fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>sessions</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {SOURCES.map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: s.color, borderRadius: 2 }}></span>{s.label}
                </span>
                <span style={{ color: "var(--fg-mute)" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Latest inquiries</h3>
            <Btn variant="link" onClick={() => window.__adminNav("inquiries")}>View all <I.arrow style={{ width: 12, height: 12 }} /></Btn>
          </div>
          <table className="dt">
            <thead><tr><th>ID</th><th>Client</th><th>Subject</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {INQUIRIES.slice(0, 5).map((q) => (
                <tr key={q.id}>
                  <td><span className="row-id">{q.id}</span></td>
                  <td>
                    <div className="cell-title">{q.name}</div>
                    <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{q.company}</div>
                  </td>
                  <td style={{ maxWidth: 260, color: "var(--fg-dim)" }}>{q.subject}</td>
                  <td><StatusPill status={q.status} /></td>
                  <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{q.date.split(" · ")[0]}</td>
                  <td><button className="icon-btn"><I.chevron /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Activity</h3>
          <div style={{ marginTop: 8 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot"></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--fg-dim)" }}>
                    <span style={{ color: "var(--fg)", fontWeight: 500 }}>{a.who}</span> {a.action} <span style={{ color: "var(--fg)" }}>{a.target}</span>
                  </div>
                  <div className="activity-meta">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }) {
  const map = {
    "New": "tag-accent",
    "In review": "tag-info",
    "Replied": "tag",
    "Won": "tag-accent",
    "Closed": "tag",
    "Published": "tag-accent",
    "Draft": "tag-warn",
    "Open": "tag-accent",
    "Closed": "tag",
    "Onsite": "tag-info",
    "Offer": "tag-accent",
    "Tech screen": "tag-info",
    "Portfolio review": "tag-warn",
    "Hiring manager": "tag-info",
    "Rejected": "tag-danger",
  };
  return <span className={`tag ${map[status] || "tag"}`}>{status}</span>;
}

// =============================================================
// ANALYTICS
// =============================================================
function AnalyticsPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Site traffic, conversion and engagement</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="select" style={{ width: 160 }}><option>Last 12 months</option><option>Last 30 days</option><option>Last 7 days</option></select>
          <Btn variant="ghost" size="sm"><I.download style={{ width: 14, height: 14 }} /> Export CSV</Btn>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "Page views", val: "892K", trend: "+12.1%", spark: KPI_VISITORS.map(v => v * 7), color: "var(--accent)" },
          { label: "Avg. session", val: "4m 38s", trend: "+11s", spark: [42, 48, 52, 46, 51, 55, 58, 62, 60, 65, 68, 72], color: "#4F7BE6" },
          { label: "Bounce rate", val: "32%", trend: "-3.4%", spark: [42, 41, 38, 39, 37, 36, 35, 34, 33, 33, 32, 32].reverse(), color: "#F5A524" },
          { label: "Conv. rate", val: "4.2%", trend: "+0.6%", spark: [2.1, 2.4, 2.6, 2.9, 3.1, 3.2, 3.4, 3.6, 3.8, 3.9, 4.0, 4.2], color: "#C792EA" },
        ].map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{k.val}</div>
            <span className="kpi-trend">{k.trend}</span>
            <div className="kpi-spark"><Sparkline values={k.spark} color={k.color} h={36} w={240} /></div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 500 }}>Pageviews by month</h3>
        <p style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 0 }}>892,140 total · +12.1% vs prior year</p>
        <div style={{ marginTop: 16 }}>
          <BarChart values={KPI_VISITORS.map(v => v * 7)} labels={MONTHS} height={240} />
        </div>
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Top pages</h3>
          <table className="dt">
            <thead><tr><th>Path</th><th>Views</th><th>Avg. time</th><th>Bounce</th></tr></thead>
            <tbody>
              {[
                ["/", "302,418", "5m 12s", "28%"],
                ["/portfolio", "168,802", "6m 04s", "22%"],
                ["/services", "142,008", "4m 28s", "31%"],
                ["/blog/rag-systems", "98,140", "9m 11s", "12%"],
                ["/careers", "62,341", "3m 22s", "38%"],
                ["/about", "41,002", "2m 18s", "44%"],
              ].map(([p, v, t, b]) => (
                <tr key={p}>
                  <td className="mono" style={{ fontSize: 12.5, color: "var(--accent)" }}>{p}</td>
                  <td>{v}</td>
                  <td style={{ color: "var(--fg-dim)" }}>{t}</td>
                  <td style={{ color: "var(--fg-dim)" }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Top referrers</h3>
          <table className="dt">
            <thead><tr><th>Source</th><th>Sessions</th><th>Conv.</th></tr></thead>
            <tbody>
              {[
                ["Hacker News", "28,402", "5.8%"],
                ["GitHub", "18,140", "3.2%"],
                ["Google", "16,802", "2.1%"],
                ["Twitter / X", "12,008", "4.4%"],
                ["LinkedIn", "8,322", "6.1%"],
                ["Direct", "32,108", "—"],
              ].map(([s, v, c]) => (
                <tr key={s}>
                  <td><span style={{ fontWeight: 500 }}>{s}</span></td>
                  <td>{v}</td>
                  <td><span className="tag-accent tag">{c}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AdminShell, OverviewPage, AnalyticsPage, StatusPill });
