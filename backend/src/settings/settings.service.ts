import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

type Setting = { key: string; value: Record<string, unknown> };

/** Settings keys whose value is safe to expose to the public marketing site. */
export const PUBLIC_KEYS = new Set([
  "site.hero",
  "site.about",
  "site.footer",
  "site.social",
  "site.seo",
]);

/** Default values returned when a key has never been saved. */
const DEFAULTS: Record<string, Record<string, unknown>> = {
  "site.hero": {
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
  "site.about": {
    headline: "A studio of operators, not consultants.",
    intro: "Silifton was founded in 2019 by engineers who'd led platform teams at scaled software companies.",
  },
  "site.footer": {
    tagline: "Senior-only engineering studio. Production or it didn't happen.",
    address: "Dhaka · London · Lagos",
    email: "hello@silifton.com",
    copyright: `© ${new Date().getFullYear()} Silifton. All rights reserved.`,
  },
  "site.social": {
    twitter: "",
    linkedin: "",
    github: "",
    youtube: "",
  },
  "site.seo": {
    title: "Silifton — Engineered software for serious teams",
    description: "A senior-only engineering studio for fintech, health, and AI-native products.",
    keywords: "software studio, fintech, healthtech, AI engineering, senior engineers",
    ogImage: "",
  },
  "workspace.general": {
    workspaceName: "Silifton",
    publicDomain: "silifton.com",
    adminDomain: "admin.silifton.com",
    timezone: "GMT+6 — Dhaka",
    siteOnline: true,
  },
};

@Injectable()
export class SettingsService {
  constructor(@InjectModel("Setting") private readonly model: Model<Setting>) {}

  async get(key: string): Promise<Record<string, unknown>> {
    const doc = await this.model.findOne({ key }).lean();
    const stored = (doc?.value ?? {}) as Record<string, unknown>;
    return { ...(DEFAULTS[key] ?? {}), ...stored };
  }

  async getMany(keys: string[]): Promise<Record<string, Record<string, unknown>>> {
    const out: Record<string, Record<string, unknown>> = {};
    await Promise.all(keys.map(async (k) => { out[k] = await this.get(k); }));
    return out;
  }

  async getPublic(): Promise<Record<string, Record<string, unknown>>> {
    return this.getMany([...PUBLIC_KEYS]);
  }

  async set(key: string, value: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.model.findOneAndUpdate(
      { key },
      { $set: { value } },
      { upsert: true, new: true },
    );
    return this.get(key);
  }
}
