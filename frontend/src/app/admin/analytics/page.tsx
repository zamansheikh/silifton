import { Icon } from "@/components/ui/icon";
import { Sparkline, BarChart } from "@/components/ui/charts";
import { getAnalyticsSeries } from "@/lib/content";

export const revalidate = 30;

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

function formatBounce(v: number): string {
  if (!v) return "—";
  return `${v.toFixed(1)}%`;
}

export default async function AnalyticsPage() {
  const series = await getAnalyticsSeries();
  const totalVisitors = series.visitors.reduce((a, b) => a + b, 0);
  const prevWindow = series.visitors.slice(-2);
  const monthOverMonth =
    prevWindow.length === 2 && prevWindow[0] > 0
      ? Math.round(((prevWindow[1] - prevWindow[0]) / prevWindow[0]) * 1000) / 10
      : 0;

  const kpis = [
    {
      label: "Unique visitors / 12mo",
      val: formatValue(totalVisitors),
      trend: monthOverMonth ? `${monthOverMonth > 0 ? "+" : ""}${monthOverMonth}% MoM` : "—",
      spark: series.visitors,
      color: "var(--accent)",
    },
    {
      label: "Page views · last 30d",
      val: formatValue(series.totalLast30),
      trend: `${series.uniquesLast30.toLocaleString()} uniques`,
      spark: series.visitors.slice(-6),
      color: "#4F7BE6",
    },
    {
      label: "Pages / visitor",
      val: series.avgPagesPerVisitor ? series.avgPagesPerVisitor.toFixed(1) : "—",
      trend: "Last 30 days",
      spark: series.visitors,
      color: "#F5A524",
    },
    {
      label: "Bounce rate",
      val: formatBounce(series.bounceRate),
      trend: "Single-page visitors",
      spark: series.visitors.slice(-6),
      color: "#C792EA",
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">
            Real first-party tracking. {totalVisitors === 0
              ? "No visits recorded yet — open the public site to start collecting data."
              : "Visitor counts are de-duplicated per day."}
          </p>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{k.val}</div>
            <span className="kpi-trend">{k.trend}</span>
            <div className="kpi-spark">
              <Sparkline values={k.spark.length ? k.spark : [0, 0, 0, 0, 0, 0]} color={k.color} width={240} height={36} />
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 500 }}>Visitors by month</h3>
        <p style={{ color: "var(--fg-mute)", fontSize: 12.5, marginTop: 0 }}>
          {formatValue(totalVisitors)} unique visitors across 12 months
        </p>
        <div style={{ marginTop: 16 }}>
          <BarChart values={series.visitors} labels={series.months} height={240} />
        </div>
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Top pages · last 30 days</h3>
          {series.topPages.length === 0 ? (
            <div style={{ padding: 32, color: "var(--fg-mute)", fontSize: 13, textAlign: "center" }}>
              No page views in the last 30 days.
            </div>
          ) : (
            <table className="dt">
              <thead><tr><th>Path</th><th>Views</th><th>Unique visitors</th></tr></thead>
              <tbody>
                {series.topPages.map((p) => (
                  <tr key={p.path}>
                    <td className="mono" style={{ fontSize: 12.5, color: "var(--accent)" }}>{p.path}</td>
                    <td>{p.views.toLocaleString()}</td>
                    <td style={{ color: "var(--fg-dim)" }}>{p.uniques.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Top referrers · last 30 days</h3>
          {series.topReferrers.length === 0 ? (
            <div style={{ padding: 32, color: "var(--fg-mute)", fontSize: 13, textAlign: "center" }}>
              No referred traffic yet — visits without a referrer are bucketed as Direct.
            </div>
          ) : (
            <table className="dt">
              <thead><tr><th>Source</th><th>Sessions</th><th>Bucket</th></tr></thead>
              <tbody>
                {series.topReferrers.map((r) => (
                  <tr key={r.referrer}>
                    <td><span style={{ fontWeight: 500, wordBreak: "break-all", fontSize: 12.5 }}>{r.referrer}</span></td>
                    <td>{r.sessions.toLocaleString()}</td>
                    <td>
                      <span className="tag" style={{ background: "var(--surface-2)" }}>
                        <Icon name="external" size={11} /> {r.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
