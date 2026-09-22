"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Career } from "@/lib/types";

// Open roles with a team filter. Roles arrive from the server so the first
// paint shows real openings, not a placeholder.
export function CareersList({ careers }: { careers: Career[] }) {
  const open = useMemo(() => careers.filter((c) => c.status === "Open"), [careers]);
  const teams = useMemo(() => ["All", ...Array.from(new Set(open.map((c) => c.team)))], [open]);
  const [team, setTeam] = useState<string>("All");
  const visible = team === "All" ? open : open.filter((c) => c.team === team);

  return (
    <div className="panel" style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h3 className="h3">Open roles · {open.length}</h3>
        {teams.length > 2 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {teams.map((tt) => (
              <button key={tt} className={cn("btn", "btn-sm", team === tt ? "btn-primary" : "btn-ghost")} onClick={() => setTeam(tt)}>
                {tt}
              </button>
            ))}
          </div>
        )}
      </div>
      {visible.length === 0 && (
        <div style={{ padding: "28px 0", color: "var(--fg-mute)", borderTop: "1px solid var(--border)" }}>
          No open roles right now. Send us a note anyway — we keep a short list.
        </div>
      )}
      {visible.map((j) => (
        <div key={j.id} className="role-row" style={{ padding: "20px 0", borderTop: "1px solid var(--border)" }}>
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
  );
}
