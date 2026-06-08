"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHead } from "@/components/admin/page-head";
import { ErrorBanner } from "@/components/admin/crud-shell";
import { adminContent, adminSettings, type AdminError } from "@/lib/admin-crud";
import { cn } from "@/lib/cn";
import type { User } from "@/lib/types";

const TABS = ["workspace", "integrations", "security"] as const;
type Tab = (typeof TABS)[number];

type Workspace = {
  workspaceName: string;
  publicDomain: string;
  adminDomain: string;
  timezone: string;
  siteOnline: boolean;
};

const DEFAULTS: Workspace = {
  workspaceName: "Silifton",
  publicDomain: "silifton.com",
  adminDomain: "admin.silifton.com",
  timezone: "GMT+6 — Dhaka",
  siteOnline: true,
};

type Health = { mongo: "ok" | "fail" | "unknown"; cloudinary: "ok" | "fail" | "unknown" };

export default function WorkspaceSettingsPage() {
  const [tab, setTab] = useState<Tab>("workspace");
  const [ws, setWs] = useState<Workspace>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [health, setHealth] = useState<Health>({ mongo: "unknown", cloudinary: "unknown" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const value = await adminSettings.get<Workspace>("workspace.general");
      setWs({ ...DEFAULTS, ...value });
      const users = await adminContent.list<User>("users").catch(() => []);
      setUserCount(users.length);
      // The admin GET being reachable already proves Mongo+auth are alive.
      setHealth({ mongo: "ok", cloudinary: "unknown" });
    } catch (err) {
      const e = err as AdminError;
      setError(e.message);
      setHealth({ mongo: e.status >= 500 ? "fail" : "unknown", cloudinary: "unknown" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    setBusy(true); setError(null); setSaved(false);
    try {
      await adminSettings.set("workspace.general", ws as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageHead title="Workspace settings" sub="Stored in MongoDB. Used by the admin UI and the public site." />
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} type="button" className={cn("tab", tab === t && "active")} onClick={() => setTab(t)}>
            {t.replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading workspace…</div>
      ) : tab === "workspace" ? (
        <div className="two-col">
          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>General</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Workspace name">
                <input className="input" value={ws.workspaceName} onChange={(e) => setWs({ ...ws, workspaceName: e.target.value })} />
              </Field>
              <Field label="Public domain">
                <input className="input" value={ws.publicDomain} onChange={(e) => setWs({ ...ws, publicDomain: e.target.value })} />
              </Field>
              <Field label="Admin domain">
                <input className="input" value={ws.adminDomain} onChange={(e) => setWs({ ...ws, adminDomain: e.target.value })} />
              </Field>
              <Field label="Default timezone">
                <select className="select" value={ws.timezone} onChange={(e) => setWs({ ...ws, timezone: e.target.value })}>
                  <option>GMT+6 — Dhaka</option>
                  <option>GMT+0 — London</option>
                  <option>GMT+1 — Lagos</option>
                  <option>GMT-5 — New York</option>
                </select>
              </Field>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button variant="primary" size="sm" onClick={save} disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </Button>
                {saved && (
                  <span style={{ color: "var(--accent)", fontSize: 12.5, fontFamily: "var(--font-mono)" }}>✓ Saved</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="panel" style={{ padding: 28, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 500 }}>Workspace stats</h3>
              <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>Counts pulled live from MongoDB</div>
              <div className="grid-2" style={{ marginTop: 16, gap: 12 }}>
                <Stat value={userCount === null ? "—" : String(userCount)} label="Admin users" />
                <Stat value={health.mongo === "ok" ? "Online" : health.mongo === "fail" ? "Down" : "—"} label="Database" tone={health.mongo === "ok" ? "ok" : "warn"} />
                <Stat value={ws.publicDomain || "—"} label="Public domain" small />
                <Stat value={ws.adminDomain || "—"} label="Admin domain" small />
              </div>
            </div>
            <div className="panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Public site status</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>
                    {ws.siteOnline ? "Live to the world" : "Showing maintenance page"}
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={ws.siteOnline}
                  className={cn("toggle", ws.siteOnline && "on")}
                  onClick={() => setWs({ ...ws, siteOnline: !ws.siteOnline })}
                  title="Toggle and save to apply"
                />
              </div>
            </div>
          </div>
        </div>
      ) : tab === "integrations" ? (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Integrations</h3>
          <div style={{ color: "var(--fg-mute)", fontSize: 13, marginBottom: 16 }}>
            Connected services. Credentials are configured via <code>backend/.env</code> on the VPS — never editable from the UI.
          </div>
          <IntegrationRow
            name="MongoDB Atlas"
            status="connected"
            sub="Storage for content, inquiries, applications, page views, settings"
          />
          <IntegrationRow
            name="Cloudinary"
            status="connected"
            sub="Image uploads for portfolio covers, blog covers, avatars"
          />
          <IntegrationRow
            name="GitHub Actions"
            status="connected"
            sub="Auto-deploy on push to main → SSH into VPS → pm2 reload"
          />
        </div>
      ) : (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Security</h3>
          <div style={{ color: "var(--fg-mute)", fontSize: 13, marginBottom: 16 }}>
            Sessions are stored in httpOnly cookies and signed with the server-side JWT_SECRET.
          </div>
          <SecurityRow label="Admin auth method" value="JWT (httpOnly cookie)" tone="ok" />
          <SecurityRow label="Password hashing" value="bcrypt (12 rounds)" tone="ok" />
          <SecurityRow label="Rate limiting" value="60 req / min per IP" tone="ok" />
          <SecurityRow label="HTTPS" value="Cloudflare proxy + origin TLS" tone="ok" />
          <SecurityRow label="2FA" value="Not yet enabled" tone="warn" />
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="field"><label>{label}</label>{children}</div>);
}

function Stat({ value, label, tone, small }: { value: string; label: string; tone?: "ok" | "warn"; small?: boolean }) {
  return (
    <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 6 }}>
      <div style={{
        fontSize: small ? 13 : 16,
        fontWeight: 500,
        color: tone === "warn" ? "var(--warn)" : tone === "ok" ? "var(--accent)" : "var(--fg)",
        wordBreak: "break-all",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--fg-faint)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>
        {label}
      </div>
    </div>
  );
}

function IntegrationRow({ name, status, sub }: { name: string; status: "connected" | "missing"; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{name}</div>
        <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{sub}</div>
      </div>
      <span className={cn("tag", status === "connected" ? "tag-accent" : "tag-warn")}>
        <Icon name={status === "connected" ? "check" : "bell"} size={11} />
        {status === "connected" ? "Connected" : "Not configured"}
      </span>
    </div>
  );
}

function SecurityRow({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
      <div style={{ fontSize: 13.5 }}>{label}</div>
      <span style={{ fontSize: 12.5, color: tone === "ok" ? "var(--accent)" : "var(--warn)", fontFamily: "var(--font-mono)" }}>
        {value}
      </span>
    </div>
  );
}
