"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { StatusPill } from "@/components/admin/status-pill";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { adminContent } from "@/lib/admin-crud";
import type { Post } from "@/lib/types";

const CATEGORIES = ["Engineering", "Design", "Culture", "Operations", "AI"];

type FormState = {
  id?: string;
  title: string;
  author: string;
  date: string;
  read: string;
  category: string;
  status: "Published" | "Draft";
  excerpt: string;
  body: string;
  image?: string;
  imagePublicId?: string;
};

const EMPTY: FormState = {
  title: "", author: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  read: "5 min", category: "Engineering", status: "Draft", excerpt: "", body: "",
};

export default function BlogAdminPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await adminContent.list<Post>("posts")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const startEdit = (p: Post) => {
    setForm({
      id: p.id, title: p.title, author: p.author, date: p.date, read: p.read,
      category: p.category, status: p.status, excerpt: p.excerpt ?? "", body: p.body ?? "",
      image: p.image, imagePublicId: p.imagePublicId,
    });
    setEditing(p.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.body.trim()) {
      setError("Title, author, and body are required."); return;
    }
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      date: form.date,
      read: form.read,
      category: form.category,
      status: form.status,
      excerpt: form.excerpt.trim(),
      body: form.body,
      image: form.image,
      imagePublicId: form.imagePublicId,
      // views preserved by backend ($set only sends these fields)
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") {
        await adminContent.create("posts", { ...payload, views: 0 });
      } else if (form.id) {
        await adminContent.update("posts", form.id, payload);
      }
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (p: Post) => {
    if (!confirm(`Delete post "${p.title}"?`)) return;
    setBusy(true); setError(null);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    try { await adminContent.remove("posts", p.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const togglePublish = async (p: Post) => {
    const next = p.status === "Published" ? "Draft" : "Published";
    setBusy(true); setError(null);
    try {
      await adminContent.update("posts", p.id, { status: next });
      await load();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase()))
    : items;

  const published = items.filter((p) => p.status === "Published").length;
  const drafts = items.filter((p) => p.status === "Draft").length;

  return (
    <>
      <PageHead title="Blog posts" sub={`${published} published, ${drafts} drafts`} />
      <AdminToolbar count={items.length} label="posts" search={search} onSearch={setSearch} actionLabel="New post" onAction={startCreate} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "New post" : `Editing — ${form.title || "post"}`} id={editing === "new" ? null : form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Author</label>
                <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
              </div>
              <div className="field">
                <label>Date (display)</label>
                <input className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="May 12, 2026" />
              </div>
              <div className="field">
                <label>Read time</label>
                <input className="input" value={form.read} onChange={(e) => setForm({ ...form, read: e.target.value })} placeholder="9 min" />
              </div>
              <div className="field">
                <label>Category</label>
                <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Published" | "Draft" })}>
                  <option>Draft</option><option>Published</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Excerpt (1–2 sentences shown on cards)</label>
              <textarea className="textarea" style={{ minHeight: 70 }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="field">
              <label>Body — paragraphs separated by blank lines</label>
              <textarea className="textarea" style={{ minHeight: 240, fontFamily: "var(--font-mono)", fontSize: 13 }} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
            </div>
            <ImageUpload
              label="Cover image"
              value={form.image}
              onChange={(url, meta?: UploadResult) =>
                setForm({ ...form, image: url || undefined, imagePublicId: url ? meta?.publicId : undefined })
              }
              helperText="Drag & drop or click. Shown on /blog cards and the post hero. Falls back to the letter gradient when empty."
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Create post" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="dt">
          <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Views</th><th>Status</th><th>Published</th><th></th></tr></thead>
          <tbody>
            {loading && items.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>{search ? "No matches." : "No posts yet."}</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} style={editing === p.id ? { background: "var(--surface-2)" } : undefined}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40, height: 28, borderRadius: 4, flexShrink: 0,
                      background: p.image ? `url(${p.image}) center/cover` : "linear-gradient(135deg, var(--surface-2), var(--surface-0))",
                      border: "1px solid var(--border)",
                    }} aria-hidden />
                    <div style={{ minWidth: 0 }}>
                      <div className="cell-title" style={{ maxWidth: 340 }}>{p.title}</div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12, marginTop: 2 }}>{p.read} read · {p.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ width: 26, height: 26, fontSize: 11 }}>{p.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}</div>
                    <span style={{ fontSize: 13 }}>{p.author}</span>
                  </div>
                </td>
                <td><span className="tag">{p.category}</span></td>
                <td className="mono" style={{ fontSize: 12.5 }}>{p.views ? p.views.toLocaleString() : "—"}</td>
                <td>
                  <button type="button" onClick={() => togglePublish(p)} disabled={busy} title={p.status === "Published" ? "Unpublish" : "Publish"} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                    <StatusPill status={p.status} />
                  </button>
                </td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{p.date}</td>
                <td>
                  <div className="row-actions">
                    <a href={`/blog/${p.id}`} target="_blank" rel="noreferrer" className="icon-btn" title="Preview"><Icon name="eye" /></a>
                    <button type="button" className="icon-btn" onClick={() => startEdit(p)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                    <button type="button" className="icon-btn danger" onClick={() => remove(p)} title="Delete" disabled={busy}><Icon name="trash" /></button>
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
