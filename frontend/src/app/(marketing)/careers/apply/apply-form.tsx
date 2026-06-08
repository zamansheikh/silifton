"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Career } from "@/lib/types";

export function ApplyForm({ roles, initialRoleId }: { roles: Career[]; initialRoleId: string }) {
  const [form, setForm] = useState({
    candidate: "",
    email: "",
    roleId: initialRoleId,
    linkedin: "",
    portfolio: "",
    note: "",
    source: "Careers page",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";
      const res = await fetch(`${base}/api/applications`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Request failed (${res.status})`);
      }
      const body = (await res.json()) as { id: string };
      setApplicationId(body.id);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  if (status === "sent") {
    return (
      <div className="panel" style={{ padding: 48, textAlign: "center" }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(61,220,154,0.12)", border: "1px solid var(--accent)",
            display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--accent)",
          }}
        >
          <Icon name="check" size={24} />
        </div>
        <h3 className="h3">Application received.</h3>
        <p style={{ color: "var(--fg-mute)", marginTop: 12 }}>
          Reference: <span className="mono accent-text">{applicationId}</span>
        </p>
        <p style={{ color: "var(--fg-mute)", marginTop: 8 }}>
          We&apos;ll be in touch within five business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel" style={{ padding: 40 }}>
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="field" style={{ gridColumn: "span 2" }}>
          <label>Role</label>
          <select
            className="select"
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
            required
          >
            {roles.length === 0 && <option value="">No open roles right now</option>}
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} · {r.team} · {r.location}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Your name</label>
          <input
            className="input"
            value={form.candidate}
            onChange={(e) => setForm({ ...form, candidate: e.target.value })}
            placeholder="Sara Chen"
            required
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field">
          <label>LinkedIn (optional)</label>
          <input
            className="input"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="field">
          <label>Portfolio / GitHub (optional)</label>
          <input
            className="input"
            value={form.portfolio}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="field" style={{ gridColumn: "span 2" }}>
          <label>Anything else? (optional)</label>
          <textarea
            className="textarea"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="What are you most excited to build here?"
          />
        </div>
        <div className="field">
          <label>How did you hear about us?</label>
          <select
            className="select"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            <option>Careers page</option>
            <option>Referral</option>
            <option>LinkedIn</option>
            <option>Twitter / X</option>
            <option>Recruiter</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 20, padding: "12px 14px",
            border: "1px solid rgba(255,90,95,0.3)", background: "rgba(255,90,95,0.06)",
            color: "var(--danger)", borderRadius: 8, fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: 28, display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}
      >
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
          We never share your details. <span className="accent-text">Reviewed by a hiring manager.</span>
        </div>
        <Button variant="primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Submitting…" : <>Submit application <Icon name="arrow" size={14} /></>}
        </Button>
      </div>
    </form>
  );
}
