"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { StatusPill } from "@/components/admin/status-pill";
import { ErrorBanner } from "@/components/admin/crud-shell";
import { adminInquiries } from "@/lib/admin-crud";
import { cn } from "@/lib/cn";
import type { Inquiry } from "@/lib/types";

const STATUSES = ["New", "In review", "Replied", "Won", "Closed"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminInquiries.list<Inquiry>();
      setInquiries(data);
      setSelected((curr) => (curr ? data.find((x) => x.id === curr.id) ?? data[0] ?? null : data[0] ?? null));
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const patch = async (id: string, body: Partial<Pick<Inquiry, "status" | "priority">>) => {
    setBusy(true); setError(null);
    setInquiries((prev) => prev.map((x) => (x.id === id ? { ...x, ...body } : x)));
    setSelected((curr) => (curr && curr.id === id ? { ...curr, ...body } : curr));
    try { await adminInquiries.update(id, body); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const remove = async (q: Inquiry) => {
    if (!confirm(`Archive inquiry from ${q.name}?`)) return;
    setBusy(true); setError(null);
    setInquiries((prev) => prev.filter((x) => x.id !== q.id));
    setSelected((curr) => (curr && curr.id === q.id ? inquiries.find((x) => x.id !== q.id) ?? null : curr));
    try { await adminInquiries.remove(q.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const counts = {
    new: inquiries.filter((q) => q.status === "New").length,
    awaiting: inquiries.filter((q) => q.status !== "Closed" && q.status !== "Won").length,
  };

  return (
    <>
      <PageHead title="Contact inquiries" sub={`${counts.new} new · ${counts.awaiting} awaiting reply`} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading && inquiries.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading…</div>
      ) : inquiries.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>No inquiries yet.</div>
      ) : (
        <div className="inquiries-split">
          <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
            <table className="dt">
              <thead>
                <tr><th>ID</th><th>From</th><th>Subject</th><th>Budget</th><th>Status</th><th>Priority</th><th>Received</th></tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => setSelected(q)}
                    style={{ cursor: "pointer", background: selected?.id === q.id ? "var(--surface-2)" : undefined }}
                  >
                    <td className="row-id">{q.id}</td>
                    <td>
                      <div className="cell-title">{q.name}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{q.company}</div>
                    </td>
                    <td style={{ color: "var(--fg-dim)" }}>{q.subject}</td>
                    <td><span className="tag">{q.budget}</span></td>
                    <td><StatusPill status={q.status} /></td>
                    <td>
                      <span className={cn("tag", q.priority === "Critical" ? "tag-danger" : q.priority === "High" ? "tag-warn" : "tag")}>
                        {q.priority}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{q.date.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="panel inquiries-detail" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
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
                  ["Received", selected.date.slice(0, 19).replace("T", " ")],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", padding: "8px 0", fontSize: 13 }}>
                    <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</span>
                    <span style={{ color: "var(--fg-dim)", wordBreak: "break-word" }}>{v}</span>
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", padding: "8px 0", fontSize: 13, alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Status</span>
                  <select
                    className="select"
                    value={selected.status}
                    disabled={busy}
                    onChange={(e) => void patch(selected.id, { status: e.target.value as Inquiry["status"] })}
                    style={{ maxWidth: 200 }}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", padding: "8px 0", fontSize: 13, alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Priority</span>
                  <select
                    className="select"
                    value={selected.priority}
                    disabled={busy}
                    onChange={(e) => void patch(selected.id, { priority: e.target.value as Inquiry["priority"] })}
                    style={{ maxWidth: 200 }}
                  >
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Message</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-dim)", whiteSpace: "pre-wrap" }}>
                  {selected.message || `${selected.subject}. We'd like to explore an engagement with budget in the ${selected.budget} range.`}
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                <Button variant="primary" size="sm" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}>
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void patch(selected.id, { status: selected.status === "Replied" ? "In review" : "Replied" })}
                  disabled={busy}
                >
                  {selected.status === "Replied" ? "Mark in review" : "Mark replied"}
                </Button>
                <button type="button" className="icon-btn danger" title="Archive" onClick={() => void remove(selected)} disabled={busy}>
                  <Icon name="trash" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
