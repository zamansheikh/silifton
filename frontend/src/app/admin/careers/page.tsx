"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { StatusPill } from "@/components/admin/status-pill";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { adminContent } from "@/lib/admin-crud";
import type { Career } from "@/lib/types";

type FormState = {
  id?: string;
  title: string;
  team: string;
  location: string;
  type: string;
  level: string;
  posted: string;
  status: "Open" | "Closed";
  applicants: number;
};

const EMPTY: FormState = {
  title: "", team: "Engineering", location: "Remote (Global)", type: "Full-time",
  level: "Senior", posted: "just now", status: "Open", applicants: 0,
};

const TEAMS = ["Engineering", "Platform", "Product", "AI", "Design", "Mobile", "Marketing", "Operations"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const LEVELS = ["Junior", "Mid", "Senior", "Staff", "Lead", "Manager", "Director"];

export default function CareersAdminPage() {
  const [items, setItems] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await adminContent.list<Career>("careers")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const startEdit = (c: Career) => {
    setForm({ ...c }); setEditing(c.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.team.trim() || !form.location.trim()) {
      setError("Title, team, and location are required."); return;
    }
    const payload = {
      title: form.title.trim(),
      team: form.team.trim(),
      location: form.location.trim(),
      type: form.type,
      level: form.level,
      posted: form.posted.trim() || "just now",
      status: form.status,
      applicants: Number(form.applicants) || 0,
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") await adminContent.create("careers", payload);
      else if (form.id) await adminContent.update("careers", form.id, payload);
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (c: Career) => {
    if (!confirm(`Delete role "${c.title}"?`)) return;
    setBusy(true); setError(null);
    setItems((prev) => prev.filter((x) => x.id !== c.id));
    try { await adminContent.remove("careers", c.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search ? items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())) : items;
  const open = items.filter((c) => c.status === "Open").length;
  const closed = items.filter((c) => c.status === "Closed").length;
  const apps = items.reduce((s, c) => s + (c.applicants || 0), 0);

  return (
    <>
      <PageHead title="Job openings" sub={`${open} open · ${closed} closed · ${apps} active applications`} />
      <AdminToolbar count={items.length} label="job openings" search={search} onSearch={setSearch} actionLabel="Post new role" onAction={startCreate} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "New job opening" : `Editing — ${form.title}`} id={editing === "new" ? null : form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Platform Engineer" required />
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Team</label>
                <select className="select" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}>
                  {TEAMS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Location</label>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote (Global)" required />
              </div>
              <div className="field">
                <label>Type</label>
                <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Level</label>
                <select className="select" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Posted (display string)</label>
                <input className="input" value={form.posted} onChange={(e) => setForm({ ...form, posted: e.target.value })} placeholder="3d ago" />
              </div>
              <div className="field">
                <label>Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Open" | "Closed" })}>
                  <option>Open</option><option>Closed</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Post role" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>ID</th><th>Role</th><th>Team</th><th>Location</th><th>Type</th><th>Status</th><th>Applicants</th><th>Posted</th><th></th></tr></thead>
          <tbody>
            {loading && items.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>{search ? "No matches." : "No roles yet."}</td></tr>
            ) : filtered.map((j) => (
              <tr key={j.id} style={editing === j.id ? { background: "var(--surface-2)" } : undefined}>
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
                    <Icon name="users" size={12} /> {j.applicants}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{j.posted}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => startEdit(j)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                    <button type="button" className="icon-btn danger" onClick={() => remove(j)} title="Delete" disabled={busy}><Icon name="trash" /></button>
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
