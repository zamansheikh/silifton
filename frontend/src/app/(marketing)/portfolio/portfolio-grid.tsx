"use client";

import { useMemo, useState } from "react";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { cn } from "@/lib/cn";
import type { PortfolioItem } from "@/lib/types";

// Sector filter + grid. Items arrive from the server so the first paint is real.
export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const industries = useMemo(() => ["all", ...Array.from(new Set(items.map((p) => p.industry)))], [items]);
  const visible = filter === "all" ? items : items.filter((p) => p.industry === filter);

  return (
    <>
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

      <section style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="portfolio-grid">
          {visible.map((p) => (
            <PortfolioCard key={p.id} item={p} span={4} />
          ))}
        </div>
      </section>
    </>
  );
}
