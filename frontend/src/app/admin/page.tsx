import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sparkline, AreaChart, Donut } from "@/components/ui/charts";
import { StatusPill } from "@/components/admin/status-pill";
import { getAnalyticsOverview, getInquiries } from "@/lib/content";

export const revalidate = 30;

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toString();
}

function formatTrend(t: number): string {
  if (t === 0) return "—";
  const sign = t > 0 ? "+" : "";
  return `${sign}${t}%`;
}

export default async function OverviewPage() {
  const [overview, inquiries] = await Promise.all([
    getAnalyticsOverview(),
    getInquiries(),
  ]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const newInquiries = inquiries.filter((q) => q.status === "New").length;
  const totalVisitors = overview.visitors.reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome back.</h1>
          <p className="page-sub">
            {today} · You have{" "}
            <span style={{ color: "var(--accent)" }}>
              {newInquiries} new {newInquiries === 1 ? "inquiry" : "inquiries"}
            </span>{" "}
            in the pipeline.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" size="sm" href="/admin/analytics">
            <Icon name="chart" size={14} /> View analytics
          </Button>
          <Button variant="primary" size="sm" href="/admin/inquiries">
            <Icon name="mail" size={14} /> Review inbox
          </Button>
        </div>
      </div>

      <div className="kpi-grid">
        {overview.kpis.map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{formatValue(k.value)}</div>
            <span className="kpi-trend" style={{ color: k.trend < 0 ? "var(--warn)" : "var(--accent)" }}>
              <Icon name={k.trend < 0 ? "arrowDown" : "arrow"} size={10} /> {formatTrend(k.trend)}
            </span>
            <div className="kpi-spark">
              <Sparkline values={k.spark} color={k.color} width={240} height={36} />
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Site performance — 12 months</h3>
              <div style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 4 }}>
                {formatValue(totalVisitors)} unique visitors · {overview.inquiries.reduce((a, b) => a + b, 0)} inquiries
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-dim)" }}>
                <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: 2 }} /> Visitors
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-dim)" }}>
                <span style={{ width: 8, height: 8, background: "#4F7BE6", borderRadius: 2 }} /> Inquiries
              </span>
            </div>
          </div>
          <AreaChart
            series={[
              { values: overview.visitors, color: "var(--accent)" },
              { values: overview.inquiries, color: "#4F7BE6" },
            ]}
            labels={overview.months}
            height={260}
          />
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Traffic sources</h3>
          <div style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 4 }}>Last 30 days</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
            <div style={{ position: "relative" }}>
              <Donut data={overview.sources.length ? overview.sources : [{ label: "No data", value: 100, color: "var(--surface-2)" }]} size={180} />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 500 }}>{formatValue(totalVisitors)}</div>
                  <div style={{ fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                    visitors
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {overview.sources.length === 0 ? (
              <div style={{ padding: "16px 0", color: "var(--fg-mute)", fontSize: 13, textAlign: "center" }}>
                No traffic recorded yet. The tracker is live — data will start appearing after the first visits.
              </div>
            ) : overview.sources.map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: s.color, borderRadius: 2 }} />
                  {s.label}
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
            <Link href="/admin/inquiries" className="btn btn-link">
              View all <Icon name="arrow" size={12} />
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <div style={{ padding: "24px 0", color: "var(--fg-mute)", fontSize: 13, textAlign: "center" }}>
              No inquiries yet.
            </div>
          ) : (
            <table className="dt">
              <thead>
                <tr><th>ID</th><th>Client</th><th>Subject</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {inquiries.slice(0, 5).map((q) => (
                  <tr key={q.id}>
                    <td><span className="row-id">{q.id}</span></td>
                    <td>
                      <div className="cell-title">{q.name}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{q.company}</div>
                    </td>
                    <td style={{ maxWidth: 260, color: "var(--fg-dim)" }}>{q.subject}</td>
                    <td><StatusPill status={q.status} /></td>
                    <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>
                      {q.date.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Activity</h3>
          <div style={{ marginTop: 8 }}>
            {overview.activity.length === 0 ? (
              <div style={{ padding: "24px 0", color: "var(--fg-mute)", fontSize: 13, textAlign: "center" }}>
                No recent activity.
              </div>
            ) : overview.activity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--fg-dim)" }}>
                    <span style={{ color: "var(--fg)", fontWeight: 500 }}>{a.who}</span> {a.action}{" "}
                    <span style={{ color: "var(--fg)" }}>{a.target}</span>
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
