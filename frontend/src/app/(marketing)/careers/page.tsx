"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { SEED_CAREERS } from "@/lib/seed";
import type { Career } from "@/lib/types";

const TEAMS = ["Engineering", "Design", "AI", "Operations"];
const PERKS: Array<[string, string]> = [
  ["Top-of-band pay", "We pay the 90th-percentile salary for your role and tenure, anywhere you live."],
  ["6-week onboarding", "Paired with a senior engineer. You ship to production in week three."],
  ["Sabbatical at 5 yr", "Three paid months. No expectation to return with a deliverable."],
  ["Conference budget", "$5,000/yr to attend, speak at, or run a conference of your choosing."],
  ["Quarterly offsite", "Four times a year, in cities the team votes on. Family welcome."],
  ["Equity from day one", "Real equity, in cash-flowing entity. Vests over 4 years."],
];

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>(SEED_CAREERS);
  const [team, setTeam] = useState<string>("Engineering");

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";
    fetch(`${base}/api/content/careers`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d) && d.length) setCareers(d as Career[]); })
      .catch(() => {});
  }, []);

  const open = useMemo(() => careers.filter((c) => c.status === "Open"), [careers]);

  return (
    <>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Careers</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Join a team of <em>senior-only</em><br />practitioners.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We hire ~6 people per year. We pay top of band, anywhere you live, and we promote on merit alone.
          </p>
        </div>
      </section>

      <section style={{ padding: "20px 0 100px" }}>
        <div className="wrap">
          <div className="panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <h3 className="h3">Open roles · {open.length}</h3>
              <div style={{ display: "flex", gap: 6 }}>
                {TEAMS.map((tt) => (
                  <button
                    key={tt}
                    className={cn("btn", "btn-sm", team === tt ? "btn-primary" : "btn-ghost")}
                    onClick={() => setTeam(tt)}
                  >
                    {tt}
                  </button>
                ))}
              </div>
            </div>
            {open.map((j) => (
              <div
                key={j.id}
                className="role-row"
                style={{
                  padding: "20px 0",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="role-row__title">
                  <div style={{ fontWeight: 500, fontSize: 16 }}>{j.title}</div>
                  <div style={{ color: "var(--fg-mute)", fontSize: 13, marginTop: 4 }}>{j.team} · {j.level}</div>
                </div>
                <div className="role-row__meta">
                  <span style={{ color: "var(--fg-dim)", fontSize: 13.5 }}>{j.location}</span>
                  <span style={{ color: "var(--fg-dim)", fontSize: 13.5 }}>{j.type}</span>
                  <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 12 }}>Posted {j.posted}</span>
                </div>
                <div className="role-row__apply">
                  <Button variant="ghost" size="sm" href={`/careers/apply?role=${encodeURIComponent(j.id)}`}>
                    Apply <Icon name="arrow" size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-3" style={{ marginTop: 80 }}>
            {PERKS.map(([k, v]) => (
              <div key={k} className="card">
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{k}</h4>
                <p style={{ color: "var(--fg-mute)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
