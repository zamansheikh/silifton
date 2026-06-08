"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { AdminToolbar } from "@/components/admin/toolbar";
import { ErrorBanner, FormPanel } from "@/components/admin/crud-shell";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { adminContent } from "@/lib/admin-crud";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/lib/types";

type FormState = {
  id?: string;
  name: string;
  role: string;
  initials: string;
  focus: string;
  avatar?: string;
  avatarPublicId?: string;
};

const EMPTY: FormState = { name: "", role: "", initials: "", focus: "" };

const deriveInitials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).map((n) => n[0] ?? "").join("").slice(0, 2).toUpperCase();

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setMembers(await adminContent.list<TeamMember>("team")); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const startCreate = () => { setForm(EMPTY); setEditing("new"); setError(null); };
  const startEdit = (m: TeamMember) => {
    if (!m.id) return;
    setForm({
      id: m.id, name: m.name, role: m.role, initials: m.initials, focus: m.focus,
      avatar: m.avatar, avatarPublicId: m.avatarPublicId,
    });
    setEditing(m.id); setError(null);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.focus.trim()) {
      setError("Name, role, and focus are required."); return;
    }
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      initials: (form.initials.trim() || deriveInitials(form.name)).slice(0, 3).toUpperCase(),
      focus: form.focus.trim(),
      avatar: form.avatar,
      avatarPublicId: form.avatarPublicId,
    };
    setBusy(true); setError(null);
    try {
      if (editing === "new") await adminContent.create("team", payload);
      else if (form.id) await adminContent.update("team", form.id, payload);
      await load();
      cancel();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (m: TeamMember) => {
    if (!m.id) return;
    if (!confirm(`Remove ${m.name} from the team?`)) return;
    setBusy(true); setError(null);
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
    try { await adminContent.remove("team", m.id); }
    catch (err) { setError((err as Error).message); await load(); }
    finally { setBusy(false); }
  };

  const filtered = search
    ? members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.focus.toLowerCase().includes(search.toLowerCase()))
    : members;

  const editingExisting = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHead title="Team members" sub={`${members.length} people on the team`} />
      <AdminToolbar
        count={members.length} label="team members" search={search} onSearch={setSearch}
        actionLabel="Add member" onAction={startCreate}
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {editing && (
        <FormPanel title={editing === "new" ? "New team member" : `Editing — ${form.name || "team member"}`} id={editing === "new" ? null : form.id}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, initials: form.initials || deriveInitials(e.target.value) })} placeholder="Mehedi Hasan" required autoFocus />
              </div>
              <div className="field">
                <label>Role</label>
                <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Chief Executive" required />
              </div>
              <div className="field">
                <label>Initials (fallback)</label>
                <input className="input" maxLength={3} value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })} placeholder="MH" required style={{ textTransform: "uppercase", letterSpacing: "0.04em" }} />
              </div>
              <div className="field">
                <label>Focus</label>
                <input className="input" value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} placeholder="Strategy, Partnerships" required />
              </div>
            </div>
            <ImageUpload
              label="Avatar photo"
              value={form.avatar}
              aspectRatio="1/1"
              onChange={(url, meta?: UploadResult) =>
                setForm({ ...form, avatar: url || undefined, avatarPublicId: url ? meta?.publicId : undefined })
              }
              helperText="Square headshot, ideally 400×400 or larger. Falls back to initials when empty."
            />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving…" : editing === "new" ? "Add member" : "Save changes"}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancel} disabled={busy}>Cancel</button>
            </div>
          </form>
        </FormPanel>
      )}

      {loading && members.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading team…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>
          {search ? "No matches." : "No team members yet — click “Add member” to add the first."}
        </div>
      ) : (
        <div className="grid-4">
          {filtered.map((p) => (
            <div
              key={p.id ?? p.name}
              className={cn("card", "card-hover")}
              style={{
                padding: 20,
                borderColor: editingExisting === p.id ? "var(--accent)" : "var(--border)",
                boxShadow: editingExisting === p.id ? "0 0 0 3px var(--accent-glow)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {p.avatar ? (
                  <div
                    aria-hidden
                    style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `url(${p.avatar}) center/cover`,
                      border: "1px solid var(--border)",
                    }}
                  />
                ) : (
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{p.initials}</div>
                )}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 500 }}>{p.name}</div>
                <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{p.role}</div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>{p.focus}</span>
                <div style={{ display: "flex", gap: 2 }}>
                  <button type="button" className="icon-btn" onClick={() => startEdit(p)} title="Edit" disabled={busy}><Icon name="edit" /></button>
                  <button type="button" className="icon-btn danger" onClick={() => remove(p)} title="Remove" disabled={busy || !p.id}><Icon name="trash" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
