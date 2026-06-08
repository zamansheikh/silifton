"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { adminContent } from "@/lib/admin-crud";
import type { User } from "@/lib/types";

const ROLES = ["Owner", "Admin", "Editor", "Author", "Viewer"] as const;
const ROLE_COLORS: Record<string, string> = {
  Owner: "tag-accent", Admin: "tag-info", Editor: "tag", Author: "tag", Viewer: "tag",
};
const ROLE_CARDS = [
  { name: "Owner", color: "var(--accent)", perms: ["Full access", "Billing", "Delete workspace", "Manage roles"] },
  { name: "Admin", color: "var(--info)", perms: ["Edit everything", "Manage users", "API keys", "No billing"] },
  { name: "Editor", color: "#C792EA", perms: ["Edit content", "Publish posts", "View inquiries", "No users/settings"] },
  { name: "Viewer", color: "var(--fg-mute)", perms: ["Read-only access", "Export reports", "No edit rights", "No inbox"] },
];

type FormState = {
  id?: string;
  name: string;
  email: string;
  role: (typeof ROLES)[number];
  initials: string;
  avatar?: string;
  avatarPublicId?: string;
};

const EMPTY: FormState = { name: "", email: "", role: "Editor", initials: "" };

const deriveInitials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setUsers(await adminContent.list<User>("users")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const startEdit = (u: User) => {
    setForm({
      id: u.id, name: u.name, email: u.email, role: u.role as (typeof ROLES)[number], initials: u.initials,
      avatar: u.avatar, avatarPublicId: u.avatarPublicId,
    });
    setEditing(u.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required."); return;
    }
    const initials = (form.initials.trim() || deriveInitials(form.name)).toUpperCase().slice(0, 2);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      initials,
      avatar: form.avatar,
      avatarPublicId: form.avatarPublicId,
      lastActive: editing === "new" ? "just now" : undefined,
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") await adminContent.create("users", payload);
      else if (form.id) await adminContent.update("users", form.id, payload);
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (u: User) => {
    if (u.you) { setError("You can't delete the account you're signed in as."); return; }
    if (!confirm(`Delete user "${u.name}"?`)) return;
    setBusy(true); setError(null);
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    try { await adminContent.remove("users", u.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <>
      <PageHead title="Users & roles" sub={`${users.length} active members · ${ROLES.length} roles`} />
      <AdminToolbar
        count={users.length} label="users" search={search} onSearch={setSearch}
        filters={[{ value: "All roles", options: ["All roles", ...ROLES] }]}
        actionLabel="Invite user" onAction={startCreate}
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "Invite user" : `Editing — ${form.name || "user"}`} id={editing === "new" ? null : form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, initials: form.initials || deriveInitials(e.target.value) })} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@silifton.com" required />
              </div>
              <div className="field">
                <label>Role</label>
                <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as (typeof ROLES)[number] })}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Initials (fallback)</label>
                <input className="input" maxLength={2} value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })} style={{ textTransform: "uppercase" }} />
              </div>
            </div>
            <ImageUpload
              label="Avatar photo"
              value={form.avatar}
              aspectRatio="1/1"
              onChange={(url, meta?: UploadResult) =>
                setForm({ ...form, avatar: url || undefined, avatarPublicId: url ? meta?.publicId : undefined })
              }
              helperText="Square headshot. Shown in the admin sidebar/users table when set."
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Invite user" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      <div className="panel" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        <table className="dt">
          <thead><tr><th>User</th><th>Role</th><th>Last active</th><th>2FA</th><th></th></tr></thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--fg-mute)" }}>{search ? "No matches." : "No users yet."}</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} style={editing === u.id ? { background: "var(--surface-2)" } : undefined}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {u.avatar ? (
                      <div aria-hidden style={{ width: 34, height: 34, borderRadius: "50%", background: `url(${u.avatar}) center/cover`, border: "1px solid var(--border)" }} />
                    ) : (
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{u.initials}</div>
                    )}
                    <div>
                      <div className="cell-title">
                        {u.name} {u.you && <span className="tag" style={{ fontSize: 10, marginLeft: 6 }}>You</span>}
                      </div>
                      <div style={{ color: "var(--fg-mute)", fontSize: 12 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`tag ${ROLE_COLORS[u.role] ?? "tag"}`}>{u.role}</span></td>
                <td className="mono" style={{ fontSize: 12, color: "var(--fg-faint)" }}>{u.lastActive}</td>
                <td>
                  <span className="tag tag-accent">
                    <Icon name="check" size={10} /> Enabled
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => startEdit(u)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                    <button type="button" className="icon-btn danger" onClick={() => remove(u)} title="Delete" disabled={busy || u.you}><Icon name="trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ margin: "32px 0 16px", fontSize: 16, fontWeight: 500 }}>Roles & permissions</h3>
      <div className="grid-4">
        {ROLE_CARDS.map((r) => (
          <div key={r.name} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${r.color}20`, border: `1px solid ${r.color}40`, display: "grid", placeItems: "center" }}>
                <Icon name="shield" size={14} />
              </div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{r.name}</h4>
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
              {r.perms.map((p) => (
                <li key={p} style={{ display: "flex", gap: 8, padding: "6px 0", fontSize: 12.5, color: "var(--fg-dim)" }}>
                  <Icon name="check" size={12} /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
