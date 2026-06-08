"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Variant = "animated" | "split" | "editorial";

export type HeroContent = {
  eyebrow: string;
  headline: string;
  sub: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  background: string;
  showStats: boolean;
};

const FALLBACK: HeroContent = {
  eyebrow: "Silifton / Engineered software",
  headline: "We build the software serious teams stake their roadmap on.",
  sub: "A senior-only engineering studio for fintech, health, and AI-native products.",
  primaryCta: "Start a project",
  primaryCtaHref: "/contact",
  secondaryCta: "See selected work",
  secondaryCtaHref: "/portfolio",
  background: "",
  showStats: true,
};

const STATS = [
  { num: "142", label: "Products shipped" },
  { num: "$2.4B", label: "Volume served" },
  { num: "98.4%", label: "SLA retention" },
  { num: "12", label: "Countries · clients" },
];

export function Hero({
  initialVariant = "animated",
  content,
}: { initialVariant?: Variant; content?: Partial<HeroContent> }) {
  const c: HeroContent = { ...FALLBACK, ...(content ?? {}) };
  const [variant, setVariant] = useState<Variant>(initialVariant);
  return (
    <>
      {variant === "animated" && <HeroAnimated c={c} />}
      {variant === "split" && <HeroSplit c={c} />}
      {variant === "editorial" && <HeroEditorial c={c} />}
      <HeroSwitcher value={variant} onChange={setVariant} />
    </>
  );
}

function HeroSwitcher({ value, onChange }: { value: Variant; onChange: (v: Variant) => void }) {
  const opts: Array<{ v: Variant; label: string }> = [
    { v: "animated", label: "Grid" },
    { v: "split", label: "Code" },
    { v: "editorial", label: "Serif" },
  ];
  return (
    <div className="hero-switcher">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn("btn", "btn-sm", value === o.v ? "btn-primary" : "btn-ghost")}
          style={value === o.v ? undefined : { borderColor: "transparent" }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CtaPair({ c }: { c: HeroContent }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
      <Button variant="primary" size="lg" href={c.primaryCtaHref}>
        {c.primaryCta} <Icon name="arrow" size={16} />
      </Button>
      <Button variant="ghost" size="lg" href={c.secondaryCtaHref}>
        {c.secondaryCta}
      </Button>
    </div>
  );
}

function HeroAnimated({ c }: { c: HeroContent }) {
  return (
    <section
      className="hero"
      style={c.background ? { background: `url(${c.background}) center/cover` } : undefined}
    >
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow-a" />
        <div className="hero-glow-b" />
      </div>
      <div className="wrap hero-inner">
        <div className="fade-up" style={{ maxWidth: 1000 }}>
          <div className="eyebrow"><span className="dot" /> {c.eyebrow}</div>
          <h1 className="h1 gradient-text display-mix" style={{ marginTop: 28 }}>
            {c.headline}
          </h1>
          <p className="lead" style={{ marginTop: 32 }}>{c.sub}</p>
          <CtaPair c={c} />
        </div>
        {c.showStats && (
          <div className="hero-statline fade-up fade-up-d2">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HeroSplit({ c }: { c: HeroContent }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow-a" style={{ opacity: 0.35 }} />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-split">
          <div className="fade-up">
            <div className="eyebrow"><span className="dot" /> {c.eyebrow}</div>
            <h1 className="h1 gradient-text display-mix" style={{ marginTop: 28, fontSize: "clamp(40px, 5.5vw, 76px)" }}>
              {c.headline}
            </h1>
            <p className="lead" style={{ marginTop: 28 }}>{c.sub}</p>
            <CtaPair c={c} />
          </div>
          <div className="fade-up fade-up-d2">
            <div className="code-card">
              <div className="code-head">
                <span className="code-dot" /><span className="code-dot" /><span className="code-dot" />
                <span className="code-title">engagement.ts — silifton</span>
              </div>
              <div className="code-body">
                <div><span className="c">// What you get on day one</span></div>
                <div><span className="k">const</span> <span className="f">engagement</span> = <span className="k">await</span> <span className="f">nexus</span>.<span className="f">start</span>({"{"}</div>
                <div>&nbsp;&nbsp;<span className="f">team</span>: [<span className="s">&quot;staff-eng&quot;</span>, <span className="s">&quot;design&quot;</span>, <span className="s">&quot;ml&quot;</span>],</div>
                <div>&nbsp;&nbsp;<span className="f">cadence</span>: <span className="s">&quot;4-day delivery&quot;</span>,</div>
                <div>&nbsp;&nbsp;<span className="f">commit</span>: <span className="s">&quot;production by week 6&quot;</span>,</div>
                <div>&nbsp;&nbsp;<span className="f">guarantees</span>: {"{"}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="f">sla</span>: <span className="n">99.9</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="f">handover</span>: <span className="s">&quot;full IP transfer&quot;</span>,</div>
                <div>&nbsp;&nbsp;{"}"}</div>
                <div>{"})"};</div>
              </div>
            </div>
            {c.showStats && (
              <div className="hero-statline" style={{ marginTop: 32, gap: 40 }}>
                <div><div className="stat-num">142</div><div className="stat-label">Shipped</div></div>
                <div><div className="stat-num">98%</div><div className="stat-label">SLA</div></div>
                <div><div className="stat-num">$2.4B</div><div className="stat-label">Volume</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroEditorial({ c }: { c: HeroContent }) {
  const issueLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-grid" style={{ opacity: 0.5 }} />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-center fade-up">
          <div className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
            <span className="dot" /> {c.eyebrow} · {issueLabel}
          </div>
          <h1 className="h1 display-mix" style={{ marginTop: 32, fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.04em" }}>
            {c.headline}
          </h1>
          <p className="lead" style={{ marginTop: 28 }}>{c.sub}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 36, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" href={c.primaryCtaHref}>
              {c.primaryCta} <Icon name="arrow" size={16} />
            </Button>
            <Button variant="ghost" size="lg" href={c.secondaryCtaHref}>
              {c.secondaryCta}
            </Button>
          </div>
        </div>
        {c.showStats && (
          <div className="hero-statline fade-up fade-up-d2" style={{ justifyContent: "center", borderTop: "1px solid var(--border)", marginTop: 80 }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
