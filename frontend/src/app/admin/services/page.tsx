"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { StatusPill } from "@/components/admin/status-pill";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { adminContent } from "@/lib/admin-crud";
import type { Service } from "@/lib/types";

const ICON_OPTIONS: IconName[] = [
  "cpu", "cloud", "bolt", "phone", "brush", "users",
  "code", "server", "globe", "shield", "chart", "layers",
];

type FormState = {
  id?: string;
  num: string;
  title: string;
  desc: string;
  icon: IconName;
  tags: string; // comma-separated
};

const EMPTY: FormState = { num: "", title: "", desc: "", icon: "cpu", tags: "" };

export default function ServicesAdminPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminContent.list<Service>("services");
      setItems(data.sort((a, b) => a.num.localeCompare(b.num)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => {
    const next = String(items.length + 1).padStart(2, "0");
    setForm({ ...EMPTY, num: next });
    setEditing("new");
    setError(null);
  };

  const startEdit = (s: Service) => {
    setForm({
      id: s.num,
      num: s.num,
      title: s.title,
      desc: s.desc,
      icon: s.icon as IconName,
      tags: s.tags.join(", "),
    });
    setEditing(s.num);
    setError(null);
  };

  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.num.trim() || !form.title.trim() || !form.desc.trim()) {
      setError("Order, title, and description are required.");
      return;
    }
    const payload = {
      num: form.num.trim(),
      title: form.title.trim(),
      desc: form.desc.trim(),
      icon: form.icon,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setBusy(true);
    setError(null);
    try {
      if (editing === "new") await adminContent.create("services", payload);
      else if (form.id) await adminContent.update("services", form.id, payload);
      await load();
      cancel();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (s: Service) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    setBusy(true); setError(null);
    setItems((prev) => prev.filter((x) => x.num !== s.num));
    try { await adminContent.remove("services", s.num); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? items.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    : items;

  const editingExisting = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHead title="Services" sub={`${items.length} capabilities shown on the marketing site`} />
      <AdminToolbar
        count={items.length}
        label="services"
        search={search}
        onSearch={setSearch}
        actionLabel="New service"
        onAction={startCreate}
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel
          title={editing === "new" ? "New service" : `Editing — ${form.title || "service"}`}
          id={editing === "new" ? null : form.id}
        >
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Order (e.g. 01)</label>
                <input className="input" value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} maxLength={4} required />
              </div>
              <div className="field">
                <label>Icon</label>
                <select className="select" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as IconName })}>
                  {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea className="textarea" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} required />
            </div>
            <div className="field">
              <label>Tags (comma-separated)</label>
              <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Next.js, Node" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Create service" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>Order</th><th>Service</th><th>Tags</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {loading && items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>{search ? "No matches." : "No services yet."}</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.num} style={editingExisting === s.num ? { background: "var(--surface-2)" } : undefined}>
                <td className="row-id">{s.num}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--accent)" }}>
                      <Icon name={s.icon as IconName} size={16} />
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
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => startEdit(s)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                    <button type="button" className="icon-btn danger" onClick={() => remove(s)} title="Delete" disabled={busy}><Icon name="trash" /></button>
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
