"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { adminContent } from "@/lib/admin-crud";
import type { Testimonial } from "@/lib/types";

type FormState = {
  id?: string;
  quote: string;
  author: string;
  role: string;
  featured: boolean;
  avatar?: string;
  avatarPublicId?: string;
};

const EMPTY: FormState = { quote: "", author: "", role: "", featured: false };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await adminContent.list<Testimonial>("testimonials")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const startEdit = (t: Testimonial) => {
    setForm({
      id: t.id, quote: t.quote, author: t.author, role: t.role, featured: t.featured,
      avatar: t.avatar, avatarPublicId: t.avatarPublicId,
    });
    setEditing(t.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quote.trim() || !form.author.trim() || !form.role.trim()) {
      setError("Quote, author, and role are required."); return;
    }
    const payload = {
      quote: form.quote.trim(),
      author: form.author.trim(),
      role: form.role.trim(),
      featured: form.featured,
      avatar: form.avatar,
      avatarPublicId: form.avatarPublicId,
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") await adminContent.create("testimonials", payload);
      else if (form.id) await adminContent.update("testimonials", form.id, payload);
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from ${t.author}?`)) return;
    setBusy(true); setError(null);
    setItems((prev) => prev.filter((x) => x.id !== t.id));
    try { await adminContent.remove("testimonials", t.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? items.filter((t) =>
        t.quote.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase()) ||
        t.role.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <>
      <PageHead title="Testimonials" sub={`${items.length} client quotes. Featured ones appear on the homepage.`} />
      <AdminToolbar count={items.length} label="testimonials" search={search} onSearch={setSearch} actionLabel="New testimonial" onAction={startCreate} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "New testimonial" : `Editing — ${form.author}`} id={editing === "new" ? null : form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Quote</label>
              <textarea className="textarea" style={{ minHeight: 100 }} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Author</label>
                <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Daniel Okafor" required />
              </div>
              <div className="field">
                <label>Role</label>
                <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="CTO, Meridian Capital" required />
              </div>
            </div>
            <ImageUpload
              label="Author photo"
              value={form.avatar}
              aspectRatio="1/1"
              onChange={(url, meta?: UploadResult) =>
                setForm({ ...form, avatar: url || undefined, avatarPublicId: url ? meta?.publicId : undefined })
              }
              helperText="Square headshot. Falls back to initials when empty."
            />
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 0" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <span style={{ fontSize: 13.5 }}>Featured on homepage</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Create" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      {loading && items.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>{search ? "No matches." : "No testimonials yet."}</div>
      ) : (
        <div className="grid-2">
          {filtered.map((t) => (
            <div key={t.id} className="card" style={{ position: "relative", borderColor: editing === t.id ? "var(--accent)" : "var(--border)" }}>
              {t.featured && (
                <span className="tag tag-accent" style={{ position: "absolute", top: 16, right: 16 }}>
                  <Icon name="star" size={11} /> Featured
                </span>
              )}
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.3, color: "var(--fg)", paddingRight: t.featured ? 80 : 0 }}>&ldquo;{t.quote}&rdquo;</div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {t.avatar ? (
                    <div aria-hidden style={{ width: 36, height: 36, borderRadius: "50%", background: `url(${t.avatar}) center/cover`, border: "1px solid var(--border)" }} />
                  ) : (
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{t.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{t.author}</div>
                    <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="icon-btn" onClick={() => startEdit(t)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                  <button type="button" className="icon-btn danger" onClick={() => remove(t)} title="Delete" disabled={busy}><Icon name="trash" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
