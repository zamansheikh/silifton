"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { cn } from "@/lib/cn";
import { SEED_PORTFOLIO } from "@/lib/seed";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(SEED_PORTFOLIO);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7001";
    fetch(`${base}/api/content/portfolio`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (Array.isArray(data) && data.length) setItems(data as PortfolioItem[]); })
      .catch(() => {});
  }, []);

  const industries = useMemo(() => ["all", ...Array.from(new Set(items.map((p) => p.industry)))], [items]);
  const visible = filter === "all" ? items : items.filter((p) => p.industry === filter);

  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Case files</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Production work, <em>publicly logged.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            142 engagements since 2019. Below is what we&apos;re allowed to talk about. Ask about the rest under NDA.
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 40, flexWrap: "wrap" }}>
            {industries.map((i) => (
              <button
                key={i}
                onClick={() => setFilter(i)}
                className={cn("btn", "btn-sm", filter === i ? "btn-primary" : "btn-ghost")}
                style={{ textTransform: i === "all" ? "capitalize" : "none" }}
              >
                {i === "all" ? "All sectors" : i}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="wrap">
          <div className="portfolio-grid">
            {visible.map((p, idx) => (
              <PortfolioCard key={p.id} item={p} span={idx === 0 ? 8 : 4} large={idx === 0} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
