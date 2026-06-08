"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { ErrorBanner } from "@/components/admin/crud-shell";
import { adminApplications } from "@/lib/admin-crud";
import type { Application } from "@/lib/types";

const STAGES = [
  "New",
  "Tech screen",
  "Portfolio review",
  "Hiring manager",
  "Onsite",
  "Offer",
  "Hired",
  "Rejected",
] as const;

const FUNNEL_STAGES = ["New", "Tech screen", "Portfolio review", "Hiring manager", "Onsite", "Offer"] as const;

export default function ApplicationsAdminPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setApps(await adminApplications.list<Application>()); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const patch = async (id: string, body: Partial<Pick<Application, "stage" | "score">>) => {
    setBusy(true); setError(null);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...body } : a)));
    try { await adminApplications.update(id, body); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const remove = async (a: Application) => {
    if (!confirm(`Delete application from ${a.candidate}?`)) return;
    setBusy(true); setError(null);
    setApps((prev) => prev.filter((x) => x.id !== a.id));
    try { await adminApplications.remove(a.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const roles = Array.from(new Set(apps.map((a) => a.role)));
  const filtered = q
    ? apps.filter((a) =>
        a.candidate.toLowerCase().includes(q.toLowerCase()) ||
        a.role.toLowerCase().includes(q.toLowerCase()))
    : apps;

  const stageCounts: Record<string, number> = {};
  for (const s of FUNNEL_STAGES) stageCounts[s] = 0;
  for (const a of apps) if (stageCounts[a.stage] !== undefined) stageCounts[a.stage] += 1;

  const active = apps.filter((a) => a.stage !== "Hired" && a.stage !== "Rejected").length;

  return (
    <>
      <PageHead title="Applications" sub={`${active} active candidates across the funnel`} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="grid-6" style={{ gap: 8, marginBottom: 24 }}>
        {FUNNEL_STAGES.map((s, i) => (
          <div key={s} className="card" style={{ padding: 16, borderColor: i === 0 ? "var(--accent)" : "var(--border)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Stage {i + 1}
            </div>
            <div style={{ fontWeight: 500, marginTop: 4, fontSize: 14 }}>{s}</div>
            <div style={{ fontSize: 26, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>{stageCounts[s]}</div>
          </div>
        ))}
      </div>

      <AdminToolbar
        count={apps.length}
        label="applications"
        search={q}
        onSearch={setQ}
        filters={[
          { value: "All stages", options: ["All stages", ...STAGES] },
          { value: "All roles", options: ["All roles", ...roles] },
        ]}
      />

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead>
            <tr><th>ID</th><th>Candidate</th><th>Applied for</th><th>Stage</th><th>Score</th><th>Source</th><th>Applied</th><th></th></tr>
          </thead>
          <tbody>
            {loading && apps.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>{q ? "No matches." : "No applications yet."}</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id}>
                <td className="row-id">{a.id}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{a.candidate.split(" ").map((x) => x[0]).join("").slice(0, 2)}</div>
                    <div>
                      <div className="cell-title">{a.candidate}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{a.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--fg-dim)" }}>{a.role}</td>
                <td>
                  <select
                    className="select"
                    value={a.stage}
                    disabled={busy}
                    onChange={(e) => void patch(a.id, { stage: e.target.value })}
                    style={{ fontSize: 12, padding: "4px 8px", minWidth: 140 }}
                  >
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${a.score}%`, height: "100%", background: a.score > 85 ? "var(--accent)" : a.score > 70 ? "var(--info)" : "var(--warn)" }} />
                    </div>
                    <input
                      type="number" min={0} max={100} value={a.score} disabled={busy}
                      onChange={(e) => {
                        const next = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        setApps((prev) => prev.map((x) => (x.id === a.id ? { ...x, score: next } : x)));
                      }}
                      onBlur={(e) => {
                        const next = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        if (next !== a.score) void patch(a.id, { score: next });
                      }}
                      className="input"
                      style={{ width: 56, padding: "2px 6px", fontSize: 12, fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </td>
                <td style={{ color: "var(--fg-mute)", fontSize: 13 }}>{a.source}</td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{a.date}</td>
                <td>
                  <div className="row-actions">
                    <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Re: your application for ${a.role}`)}`} className="icon-btn" title="Email candidate"><Icon name="mail" /></a>
                    <button type="button" className="icon-btn danger" onClick={() => void remove(a)} disabled={busy} title="Delete"><Icon name="trash" /></button>
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
