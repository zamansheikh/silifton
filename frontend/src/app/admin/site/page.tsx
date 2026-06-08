"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { ImageUpload, type UploadResult } from "@/components/admin/image-upload";
import { ErrorBanner } from "@/components/admin/crud-shell";
import { adminSettings } from "@/lib/admin-crud";
import { cn } from "@/lib/cn";

const TABS = ["hero", "about", "footer", "social", "seo"] as const;
type Tab = (typeof TABS)[number];

type Hero = {
  eyebrow: string;
  headline: string;
  sub: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  showStats: boolean;
  showMarquee: boolean;
  background: string;
  backgroundPublicId?: string;
};
type About = { headline: string; intro: string };
type FooterCfg = { tagline: string; address: string; email: string; copyright: string };
type Social = { twitter: string; linkedin: string; github: string; youtube: string };
type Seo = { title: string; description: string; keywords: string; ogImage: string; ogImagePublicId?: string };

const DEFAULTS: { hero: Hero; about: About; footer: FooterCfg; social: Social; seo: Seo } = {
  hero: {
    eyebrow: "Silifton / Engineered software",
    headline: "We build the software serious teams stake their roadmap on.",
    sub: "A senior-only engineering studio for fintech, health, and AI-native products.",
    primaryCta: "Start a project",
    primaryCtaHref: "/contact",
    secondaryCta: "See selected work",
    secondaryCtaHref: "/portfolio",
    showStats: true,
    showMarquee: true,
    background: "",
  },
  about: { headline: "A studio of operators, not consultants.", intro: "Silifton was founded in 2019…" },
  footer: { tagline: "", address: "", email: "", copyright: "" },
  social: { twitter: "", linkedin: "", github: "", youtube: "" },
  seo: { title: "", description: "", keywords: "", ogImage: "" },
};

export default function SiteSettingsPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [hero, setHero] = useState<Hero>(DEFAULTS.hero);
  const [about, setAbout] = useState<About>(DEFAULTS.about);
  const [footer, setFooter] = useState<FooterCfg>(DEFAULTS.footer);
  const [social, setSocial] = useState<Social>(DEFAULTS.social);
  const [seo, setSeo] = useState<Seo>(DEFAULTS.seo);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Tab | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminSettings.list<Record<string, Record<string, unknown>>>();
      setHero({ ...DEFAULTS.hero, ...(data["site.hero"] ?? {}) } as Hero);
      setAbout({ ...DEFAULTS.about, ...(data["site.about"] ?? {}) } as About);
      setFooter({ ...DEFAULTS.footer, ...(data["site.footer"] ?? {}) } as FooterCfg);
      setSocial({ ...DEFAULTS.social, ...(data["site.social"] ?? {}) } as Social);
      setSeo({ ...DEFAULTS.seo, ...(data["site.seo"] ?? {}) } as Seo);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async (which: Tab) => {
    setBusy(true); setError(null); setSaved(null);
    try {
      const map: Record<Tab, [string, Record<string, unknown>]> = {
        hero: ["site.hero", hero as unknown as Record<string, unknown>],
        about: ["site.about", about as unknown as Record<string, unknown>],
        footer: ["site.footer", footer as unknown as Record<string, unknown>],
        social: ["site.social", social as unknown as Record<string, unknown>],
        seo: ["site.seo", seo as unknown as Record<string, unknown>],
      };
      const [key, value] = map[which];
      await adminSettings.set(key, value);
      setSaved(which);
      setTimeout(() => setSaved((s) => (s === which ? null : s)), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead
        title="Site settings"
        sub="Edit what the public site shows. Changes are saved to MongoDB and read on next request."
      />
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} type="button" className={cn("tab", tab === t && "active")} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading settings…</div>
      ) : tab === "hero" ? (
        <div className="two-col">
          <div className="panel" style={{ padding: 28 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Hero section</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Eyebrow text">
                <input className="input" value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} />
              </Field>
              <Field label="Headline">
                <textarea className="textarea" style={{ minHeight: 90 }} value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
              </Field>
              <Field label="Subheading">
                <textarea className="textarea" value={hero.sub} onChange={(e) => setHero({ ...hero, sub: e.target.value })} />
              </Field>
              <div className="grid-2" style={{ gap: 16 }}>
                <Field label="Primary CTA label">
                  <input className="input" value={hero.primaryCta} onChange={(e) => setHero({ ...hero, primaryCta: e.target.value })} />
                </Field>
                <Field label="Primary CTA link">
                  <input className="input" value={hero.primaryCtaHref} onChange={(e) => setHero({ ...hero, primaryCtaHref: e.target.value })} />
                </Field>
                <Field label="Secondary CTA label">
                  <input className="input" value={hero.secondaryCta} onChange={(e) => setHero({ ...hero, secondaryCta: e.target.value })} />
                </Field>
                <Field label="Secondary CTA link">
                  <input className="input" value={hero.secondaryCtaHref} onChange={(e) => setHero({ ...hero, secondaryCtaHref: e.target.value })} />
                </Field>
              </div>
              <ImageUpload
                label="Hero background image"
                value={hero.background}
                onChange={(url, meta?: UploadResult) =>
                  setHero({ ...hero, background: url || "", backgroundPublicId: url ? meta?.publicId : undefined })
                }
                helperText="Optional. Shown behind the headline. Falls back to the default gradient when empty."
              />
              <Toggle label="Show statistics" sub="4 key numbers under hero" value={hero.showStats} onChange={(v) => setHero({ ...hero, showStats: v })} />
              <Toggle label="Show client marquee" sub="Scrolling list of client logos" value={hero.showMarquee} onChange={(v) => setHero({ ...hero, showMarquee: v })} />
              <SaveBar onSave={() => void save("hero")} busy={busy} saved={saved === "hero"} previewHref="/" />
            </div>
          </div>
          <div className="panel" style={{ padding: 20 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              Live preview
            </div>
            <div style={{
              background: hero.background ? `url(${hero.background}) center/cover` : "var(--surface-0)",
              border: "1px solid var(--border)", borderRadius: 8, padding: 24, minHeight: 280,
              color: hero.background ? "#fff" : undefined,
              textShadow: hero.background ? "0 2px 12px rgba(0,0,0,0.5)" : undefined,
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>
                {hero.eyebrow}
              </div>
              <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{hero.headline}</div>
              <div style={{ fontSize: 13.5, marginTop: 14, lineHeight: 1.5, opacity: 0.85 }}>{hero.sub}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <span className="btn btn-primary btn-sm">{hero.primaryCta}</span>
                <span className="btn btn-ghost btn-sm">{hero.secondaryCta}</span>
              </div>
            </div>
          </div>
        </div>
      ) : tab === "about" ? (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>About page</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Headline">
              <input className="input" value={about.headline} onChange={(e) => setAbout({ ...about, headline: e.target.value })} />
            </Field>
            <Field label="Intro paragraph">
              <textarea className="textarea" style={{ minHeight: 140 }} value={about.intro} onChange={(e) => setAbout({ ...about, intro: e.target.value })} />
            </Field>
            <SaveBar onSave={() => void save("about")} busy={busy} saved={saved === "about"} previewHref="/about" />
          </div>
        </div>
      ) : tab === "footer" ? (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Footer</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Tagline"><input className="input" value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} /></Field>
            <Field label="Address"><input className="input" value={footer.address} onChange={(e) => setFooter({ ...footer, address: e.target.value })} /></Field>
            <Field label="Contact email"><input className="input" type="email" value={footer.email} onChange={(e) => setFooter({ ...footer, email: e.target.value })} /></Field>
            <Field label="Copyright line"><input className="input" value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} /></Field>
            <SaveBar onSave={() => void save("footer")} busy={busy} saved={saved === "footer"} previewHref="/" />
          </div>
        </div>
      ) : tab === "social" ? (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>Social links</h3>
          <div className="grid-2" style={{ gap: 16 }}>
            <Field label="Twitter / X URL"><input className="input" value={social.twitter} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} placeholder="https://x.com/…" /></Field>
            <Field label="LinkedIn URL"><input className="input" value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} placeholder="https://linkedin.com/company/…" /></Field>
            <Field label="GitHub URL"><input className="input" value={social.github} onChange={(e) => setSocial({ ...social, github: e.target.value })} placeholder="https://github.com/…" /></Field>
            <Field label="YouTube URL"><input className="input" value={social.youtube} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} placeholder="https://youtube.com/@…" /></Field>
          </div>
          <div style={{ marginTop: 20 }}>
            <SaveBar onSave={() => void save("social")} busy={busy} saved={saved === "social"} previewHref="/" />
          </div>
        </div>
      ) : (
        <div className="panel" style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500 }}>SEO defaults</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Site title"><input className="input" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} /></Field>
            <Field label="Description (160 chars)">
              <textarea className="textarea" value={seo.description} maxLength={200} onChange={(e) => setSeo({ ...seo, description: e.target.value })} />
            </Field>
            <Field label="Keywords (comma-separated)">
              <input className="input" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
            </Field>
            <ImageUpload
              label="Default OG image"
              value={seo.ogImage}
              onChange={(url, meta?: UploadResult) =>
                setSeo({ ...seo, ogImage: url || "", ogImagePublicId: url ? meta?.publicId : undefined })
              }
              helperText="Shown when someone shares any page that doesn't have its own OG image. 1200×630 recommended."
            />
            <SaveBar onSave={() => void save("seo")} busy={busy} saved={saved === "seo"} previewHref="/" />
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
        <div style={{ color: "var(--fg-mute)", fontSize: 12.5 }}>{sub}</div>
      </div>
      <button type="button" aria-pressed={value} className={cn("toggle", value && "on")} onClick={() => onChange(!value)} />
    </div>
  );
}

function SaveBar({ onSave, busy, saved, previewHref }: { onSave: () => void; busy: boolean; saved: boolean; previewHref: string }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
      <Button variant="primary" size="sm" onClick={onSave} disabled={busy}>
        {busy ? "Saving…" : "Save changes"}
      </Button>
      <Button variant="ghost" size="sm" href={previewHref}>Preview on site</Button>
      {saved && (
        <span style={{ color: "var(--accent)", fontSize: 12.5, fontFamily: "var(--font-mono)" }}>
          ✓ Saved
        </span>
      )}
    </div>
  );
}
