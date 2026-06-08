"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type Budget = "$50k–$100k" | "$100k–$250k" | "$250k–$500k" | "$500k+" | "Not sure yet";

const DIRECT_LINES: Array<[string, string]> = [
  ["Partnerships & RFPs", "partners@silifton.com"],
  ["Careers", "hello@silifton.com"],
  ["Press", "press@silifton.com"],
];

const OFFICES: Array<[string, string]> = [
  ["Dhaka", "House 14, Road 27, Banani · GMT+6"],
  ["London", "Borough Yards, SE1 1RU · GMT+0"],
  ["Lagos", "Akin Adesola, Victoria Island · GMT+1"],
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", email: "",
    subject: "", budget: "$100k–$250k" as Budget, message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";
      const res = await fetch(`${base}/api/inquiries`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Request failed (${res.status})`);
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  const reset = () => {
    setForm({ name: "", company: "", email: "", subject: "", budget: "$100k–$250k", message: "" });
    setStatus("idle");
    setError(null);
  };

  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Contact</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Tell us about<br /><em>the problem.</em>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap grid-split-form">
          <div className="panel" style={{ padding: 40 }}>
            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(61,220,154,0.12)", border: "1px solid var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--accent)" }}>
                  <Icon name="check" size={24} />
                </div>
                <h3 className="h3">Thanks — we&apos;ll be in touch within one business day.</h3>
                <p style={{ color: "var(--fg-mute)", marginTop: 12 }}>
                  Inquiry routed to: <span className="mono">partners@silifton.com</span>
                </p>
                <div style={{ marginTop: 24 }}>
                  <Button variant="ghost" onClick={reset}>Send another</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="grid-2" style={{ gap: 20 }}>
                  <div className="field">
                    <label>Your name</label>
                    <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Daniel Okafor" required />
                  </div>
                  <div className="field">
                    <label>Company</label>
                    <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Meridian Capital" required />
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Work email</label>
                    <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Subject</label>
                    <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Briefly — what's the project?" />
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Estimated budget</label>
                    <select className="select" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value as Budget })}>
                      <option>$50k–$100k</option><option>$100k–$250k</option><option>$250k–$500k</option>
                      <option>$500k+</option><option>Not sure yet</option>
                    </select>
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>What are you trying to ship?</label>
                    <textarea className="textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="A few sentences are enough. Links to RFCs welcome." required />
                  </div>
                </div>
                {error && (
                  <div style={{ marginTop: 16, padding: "12px 14px", border: "1px solid rgba(255,90,95,0.3)", background: "rgba(255,90,95,0.06)", color: "var(--danger)", borderRadius: 8, fontSize: 13 }}>
                    {error}
                  </div>
                )}
                <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-faint)" }}>
                    Avg. response time: <span className="accent-text">4h 12m</span>
                  </div>
                  <Button variant="primary" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending..." : <>Send inquiry <Icon name="arrow" size={14} /></>}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div>
            <h3 className="h3" style={{ fontSize: 18 }}>Direct lines</h3>
            <div style={{ marginTop: 20 }}>
              {DIRECT_LINES.map(([k, v]) => (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{k}</div>
                  <div style={{ marginTop: 4, fontSize: 14.5 }}>
                    <a href={`mailto:${v}`}>{v}</a>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="h3" style={{ fontSize: 18, marginTop: 40 }}>Offices</h3>
            <div style={{ marginTop: 20 }}>
              {OFFICES.map(([k, v]) => (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 500 }}>{k}</div>
                  <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--fg-mute)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
