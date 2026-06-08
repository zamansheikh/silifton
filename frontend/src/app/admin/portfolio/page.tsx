"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { StatusPill } from "@/components/admin/status-pill";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { adminContent } from "@/lib/admin-crud";
import type { PortfolioItem } from "@/lib/types";

const INDUSTRIES = ["Fintech", "Healthtech", "Supply chain", "Energy", "Media", "AI", "Mobile", "Retail"];
const COLOR_OPTIONS = ["#4F8BFF", "#4F7BE6", "#F5A524", "#C792EA", "#FF5A5F"];

type FormState = {
  id?: string;
  client: string;
  industry: string;
  title: string;
  year: number;
  span: number;
  status: string;
  thumb: string;
  color: string;
  metric: string;
  summary: string;
  body: string;
  image?: string;
  imagePublicId?: string;
};

const EMPTY: FormState = {
  client: "", industry: "Fintech", title: "", year: new Date().getFullYear(), span: 4,
  status: "Live", thumb: "X", color: "#4F8BFF", metric: "", summary: "", body: "",
};

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await adminContent.list<PortfolioItem>("portfolio")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => {
    const n = String(items.length + 1).padStart(2, "0");
    setForm({ ...EMPTY, id: `case-${n}` });
    setEditing("new"); setError(null);
  };
  const startEdit = (p: PortfolioItem) => {
    setForm({
      id: p.id, client: p.client, industry: p.industry, title: p.title,
      year: p.year, span: p.span, status: p.status, thumb: p.thumb, color: p.color,
      metric: p.metric, summary: p.summary ?? "", body: p.body ?? "",
      image: p.image, imagePublicId: p.imagePublicId,
    });
    setEditing(p.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client.trim() || !form.title.trim() || !form.metric.trim()) {
      setError("Client, title, and metric are required."); return;
    }
    const payload = {
      client: form.client.trim(),
      industry: form.industry,
      title: form.title.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      span: Number(form.span) || 4,
      status: form.status,
      thumb: form.thumb.toUpperCase().slice(0, 1) || form.client.charAt(0).toUpperCase(),
      color: form.color,
      metric: form.metric.trim(),
      summary: form.summary.trim(),
      body: form.body,
      image: form.image,
      imagePublicId: form.imagePublicId,
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") await adminContent.create("portfolio", { ...payload, id: form.id });
      else if (form.id) await adminContent.update("portfolio", form.id, payload);
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (p: PortfolioItem) => {
    if (!confirm(`Delete case file "${p.title}"?`)) return;
    setBusy(true); setError(null);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    try { await adminContent.remove("portfolio", p.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <>
      <PageHead title="Portfolio & case studies" sub={`${items.length} case files shown publicly`} />
      <AdminToolbar
        count={items.length} label="case studies" search={search} onSearch={setSearch}
        filters={[{ value: "All sectors", options: ["All sectors", ...INDUSTRIES] }]}
        actionLabel="New case study" onAction={startCreate}
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "New case study" : `Editing — ${form.client}`} id={form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Client</label>
                <input className="input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value, thumb: form.thumb || e.target.value.charAt(0).toUpperCase() })} required />
              </div>
              <div className="field">
                <label>Industry</label>
                <select className="select" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Headline metric</label>
                <input className="input" value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} placeholder="$1.2B daily volume" required />
              </div>
              <div className="field">
                <label>Year</label>
                <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label>Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Live</option><option>In progress</option><option>Closed</option>
                </select>
              </div>
              <div className="field">
                <label>Grid span (4 = ⅓ row, 8 = ⅔ row)</label>
                <select className="select" value={form.span} onChange={(e) => setForm({ ...form, span: Number(e.target.value) })}>
                  <option value={4}>4 (small)</option>
                  <option value={6}>6 (half)</option>
                  <option value={8}>8 (large)</option>
                  <option value={12}>12 (full)</option>
                </select>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Thumb letter (shown if no image)</label>
                <input className="input" maxLength={1} value={form.thumb} onChange={(e) => setForm({ ...form, thumb: e.target.value.toUpperCase() })} style={{ textTransform: "uppercase" }} />
              </div>
              <div className="field">
                <label>Accent color</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      style={{ width: 32, height: 32, borderRadius: 6, background: c, border: form.color === c ? "2px solid var(--fg)" : "1px solid var(--border)", cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="field">
              <label>Summary (1–2 sentences shown on cards)</label>
              <textarea className="textarea" style={{ minHeight: 80 }} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div className="field">
              <label>Body (full case study, blank line for paragraphs)</label>
              <textarea className="textarea" style={{ minHeight: 220, fontFamily: "var(--font-mono)", fontSize: 13 }} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
            <ImageUpload
              label="Cover image"
              value={form.image}
              onChange={(url, meta?: UploadResult) =>
                setForm({ ...form, image: url || undefined, imagePublicId: url ? meta?.publicId : undefined })
              }
              helperText="Drag & drop or click. Replaces the letter+gradient fallback on the public site."
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Create case study" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      {loading && items.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading…</div>
      ) : (
        <div className="grid-3">
          {filtered.map((p) => (
            <div key={p.id} className="card card-hover" style={{ padding: 0, overflow: "hidden", borderColor: editing === p.id ? "var(--accent)" : "var(--border)" }}>
              <div style={{ aspectRatio: "16/10", position: "relative", background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${p.color}26, ${p.color}06)` }}>
                {!p.image && (
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 120, color: `${p.color}30` }}>{p.thumb}</div>
                )}
                {p.image && <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />}
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, zIndex: 1 }}>
                  <span className="tag" style={{ background: "rgba(0,0,0,0.55)" }}>{p.industry}</span>
                  <StatusPill status={p.status} />
                </div>
                <div style={{ position: "absolute", bottom: 10, right: 12, fontFamily: "var(--font-mono)", fontSize: 10.5, color: p.image ? "rgba(255,255,255,0.85)" : "var(--fg-mute)", zIndex: 1 }}>{p.id}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.client}</div>
                <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tag tag-accent">{p.metric}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <a href={`/portfolio/${p.id}`} target="_blank" rel="noreferrer" className="icon-btn" title="Preview"><Icon name="eye" /></a>
                    <button type="button" className="icon-btn" onClick={() => startEdit(p)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                    <button type="button" className="icon-btn danger" onClick={() => remove(p)} title="Delete" disabled={busy}><Icon name="trash" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div onClick={startCreate} className="card" style={{ display: "grid", placeItems: "center", border: "1.5px dashed var(--border-strong)", background: "transparent", minHeight: 280, cursor: "pointer", color: "var(--fg-mute)" }}>
            <div style={{ textAlign: "center" }}>
              <Icon name="plus" size={24} />
              <div style={{ fontWeight: 500, marginTop: 8 }}>Add case study</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
