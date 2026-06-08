import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";

import { MODEL_NAMES } from "../content/schemas/content-item.schema";
import { PageView, PageViewDocument } from "./schemas/page-view.schema";

type Record_ = Record<string, unknown>;
type WithTimestamps = { createdAt?: Date; updatedAt?: Date };

// Map a referrer URL to a coarse bucket so we can group by source.
function classifyReferrer(raw: string | undefined, ownHost: string): string {
  if (!raw) return "Direct";
  let host = "";
  try { host = new URL(raw).hostname.toLowerCase(); } catch { return "Direct"; }
  if (host === ownHost || host === `www.${ownHost}`) return "Direct";
  if (host.includes("google.")) return "Search";
  if (host.includes("bing.") || host.includes("duckduckgo.") || host.includes("yahoo.")) return "Search";
  if (host.includes("twitter.") || host === "x.com" || host.endsWith(".x.com")) return "Social";
  if (host.includes("linkedin.")) return "Social";
  if (host.includes("facebook.") || host.includes("instagram.")) return "Social";
  if (host.includes("news.ycombinator.com")) return "Referrals";
  if (host.includes("github.")) return "Referrals";
  return "Referrals";
}

const SOURCE_COLORS: Record<string, string> = {
  Direct: "#3DDC9A",
  Referrals: "#4F7BE6",
  Search: "#F5A524",
  Social: "#C792EA",
  Other: "#FF5A5F",
};

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function monthLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "short" });
}
function hashVisitor(ip: string, ua: string, day: string): string {
  return crypto.createHash("sha256").update(`${ip}|${ua}|${day}`).digest("hex").slice(0, 16);
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel("PageView") private readonly pageViews: Model<PageViewDocument>,
    @InjectModel("Inquiry") private readonly inquiries: Model<Record_ & WithTimestamps>,
    @InjectModel("Application") private readonly applications: Model<Record_ & WithTimestamps>,
    @InjectModel(MODEL_NAMES.portfolio) private readonly portfolio: Model<Record_ & WithTimestamps>,
    @InjectModel(MODEL_NAMES.posts) private readonly posts: Model<Record_ & WithTimestamps>,
    @InjectModel(MODEL_NAMES.careers) private readonly careers: Model<Record_ & WithTimestamps>,
    @InjectModel(MODEL_NAMES.team) private readonly team: Model<Record_ & WithTimestamps>,
  ) {}

  async track(input: { path: string; referrer?: string; ip: string; ua: string; host: string }): Promise<void> {
    const day = dayKey(new Date());
    const source = classifyReferrer(input.referrer, input.host);
    const visitor = hashVisitor(input.ip, input.ua, day);
    await this.pageViews.create({
      path: input.path,
      referrer: input.referrer ?? "",
      source,
      day,
      ua: input.ua.slice(0, 200),
      visitor,
    });
  }

  async overview() {
    const now = new Date();
    const months = this.last12Months(now);

    const visitorBuckets = await this.aggregateMonthlyVisitors(now);
    const visitors = months.map((m) => visitorBuckets[m.key] ?? 0);

    const inquiryMonthly = await this.monthCountFromCollection(this.inquiries, now);
    const inquiryCount = months.map((m) => inquiryMonthly[m.key] ?? 0);
    const applicationMonthly = await this.monthCountFromCollection(this.applications, now);
    const appCount = months.map((m) => applicationMonthly[m.key] ?? 0);

    const pipelineOpen = await this.inquiries.countDocuments({
      status: { $in: ["New", "In review", "Replied"] },
    });
    const openCareers = await this.careers.countDocuments({ status: "Open" });

    const sources = await this.aggregateSources(now);
    const activity = await this.buildActivity();

    const totalVisitors = visitors.reduce((a, b) => a + b, 0);
    const totalInquiries = inquiryCount.reduce((a, b) => a + b, 0);
    const totalApplications = appCount.reduce((a, b) => a + b, 0);

    return {
      kpis: [
        { label: "Visitors / mo", value: visitors[visitors.length - 1] ?? 0, total: totalVisitors, trend: this.pctTrend(visitors), spark: visitors, color: "var(--accent)" },
        { label: "Inquiries", value: inquiryCount[inquiryCount.length - 1] ?? 0, total: totalInquiries, trend: this.pctTrend(inquiryCount), spark: inquiryCount, color: "#4F7BE6" },
        { label: "Open pipeline", value: pipelineOpen, total: pipelineOpen, trend: 0, spark: inquiryCount, color: "#F5A524" },
        { label: "Open positions", value: openCareers, total: totalApplications, trend: this.pctTrend(appCount), spark: appCount, color: "#C792EA" },
      ],
      months: months.map((m) => m.label),
      visitors,
      inquiries: inquiryCount,
      sources,
      activity,
    };
  }

  async series() {
    const now = new Date();
    const months = this.last12Months(now);
    const visitorBuckets = await this.aggregateMonthlyVisitors(now);
    const visitors = months.map((m) => visitorBuckets[m.key] ?? 0);

    const since = new Date(now);
    since.setDate(since.getDate() - 30);
    const sinceDay = dayKey(since);

    const totalLast30 = await this.pageViews.countDocuments({ day: { $gte: sinceDay } });
    const uniqueVisitorsLast30 = await this.pageViews.distinct("visitor", { day: { $gte: sinceDay } });
    const avgPagesPerVisitor = uniqueVisitorsLast30.length > 0 ? totalLast30 / uniqueVisitorsLast30.length : 0;
    const bouncedVisitors = await this.aggregateBouncedVisitors(sinceDay);
    const bounceRate = uniqueVisitorsLast30.length > 0
      ? bouncedVisitors / uniqueVisitorsLast30.length
      : 0;

    const topPages = await this.pageViews.aggregate<{ path: string; views: number; uniques: number }>([
      { $match: { day: { $gte: sinceDay } } },
      { $group: { _id: "$path", views: { $sum: 1 }, visitors: { $addToSet: "$visitor" } } },
      { $project: { path: "$_id", views: 1, uniques: { $size: "$visitors" }, _id: 0 } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const topReferrers = await this.pageViews.aggregate<{ referrer: string; sessions: number; source: string }>([
      { $match: { day: { $gte: sinceDay }, referrer: { $ne: "" } } },
      {
        $group: {
          _id: { $ifNull: ["$referrer", "Direct"] },
          sessions: { $sum: 1 },
          source: { $first: "$source" },
        },
      },
      { $project: { referrer: "$_id", sessions: 1, source: 1, _id: 0 } },
      { $sort: { sessions: -1 } },
      { $limit: 10 },
    ]);

    return {
      months: months.map((m) => m.label),
      visitors,
      totalLast30,
      uniquesLast30: uniqueVisitorsLast30.length,
      avgPagesPerVisitor: Math.round(avgPagesPerVisitor * 10) / 10,
      bounceRate: Math.round(bounceRate * 1000) / 10,
      topPages,
      topReferrers,
      sources: await this.aggregateSources(now),
    };
  }

  private last12Months(now: Date): Array<{ key: string; label: string }> {
    const out: Array<{ key: string; label: string }> = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      out.push({ key, label: monthLabel(d) });
    }
    return out;
  }

  private async aggregateMonthlyVisitors(now: Date): Promise<Record<string, number>> {
    const since = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const rows = await this.pageViews.aggregate<{ _id: string; visitors: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, uniques: { $addToSet: "$visitor" } } },
      { $project: { _id: 1, visitors: { $size: "$uniques" } } },
    ]);
    const out: Record<string, number> = {};
    for (const r of rows) out[r._id] = r.visitors;
    return out;
  }

  private async aggregateBouncedVisitors(sinceDay: string): Promise<number> {
    const rows = await this.pageViews.aggregate<{ _id: string; pages: number }>([
      { $match: { day: { $gte: sinceDay } } },
      { $group: { _id: "$visitor", pages: { $sum: 1 } } },
      { $match: { pages: 1 } },
      { $count: "bounced" },
    ]);
    return (rows[0] as unknown as { bounced?: number } | undefined)?.bounced ?? 0;
  }

  private async monthCountFromCollection(
    model: Model<Record_ & WithTimestamps>,
    now: Date,
  ): Promise<Record<string, number>> {
    const since = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const rows = await model.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]);
    const out: Record<string, number> = {};
    for (const r of rows) out[r._id] = r.count;
    return out;
  }

  private async aggregateSources(now: Date): Promise<Array<{ label: string; value: number; color: string }>> {
    const since = new Date(now.getFullYear(), now.getMonth(), 1);
    since.setDate(since.getDate() - 30);
    const rows = await this.pageViews.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);
    const total = rows.reduce((a, r) => a + r.count, 0);
    if (total === 0) {
      return Object.entries(SOURCE_COLORS).slice(0, 4).map(([label, color]) => ({ label, value: 0, color }));
    }
    return rows
      .map((r) => ({
        label: r._id || "Direct",
        value: Math.round((r.count / total) * 100),
        color: SOURCE_COLORS[r._id] ?? SOURCE_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }

  private async buildActivity(): Promise<Array<{ who: string; action: string; target: string; time: string }>> {
    const [inqs, apps, posts, port, team] = await Promise.all([
      this.inquiries.find({}, { name: 1, company: 1, subject: 1, createdAt: 1, id: 1 })
        .sort({ createdAt: -1 }).limit(5).lean(),
      this.applications.find({}, { candidate: 1, role: 1, stage: 1, createdAt: 1, id: 1 })
        .sort({ createdAt: -1 }).limit(5).lean(),
      this.posts.find({}, { title: 1, author: 1, updatedAt: 1, status: 1, id: 1 })
        .sort({ updatedAt: -1 }).limit(5).lean(),
      this.portfolio.find({}, { client: 1, title: 1, updatedAt: 1, id: 1 })
        .sort({ updatedAt: -1 }).limit(3).lean(),
      this.team.find({}, { name: 1, updatedAt: 1, id: 1 }).sort({ updatedAt: -1 }).limit(3).lean(),
    ]);

    const items: Array<{ when: Date; who: string; action: string; target: string }> = [];
    for (const i of inqs as Array<Record_ & WithTimestamps>) items.push({
      when: i.createdAt ?? new Date(0),
      who: "System",
      action: "received new inquiry from",
      target: `${(i.name as string) ?? ""} · ${(i.company as string) ?? ""}`.trim(),
    });
    for (const a of apps as Array<Record_ & WithTimestamps>) items.push({
      when: a.createdAt ?? new Date(0),
      who: "System",
      action: `moved candidate to ${(a.stage as string) ?? "New"}:`,
      target: `${(a.candidate as string) ?? ""} — ${(a.role as string) ?? ""}`,
    });
    for (const p of posts as Array<Record_ & WithTimestamps>) items.push({
      when: p.updatedAt ?? new Date(0),
      who: (p.author as string) ?? "Editor",
      action: p.status === "Published" ? "published" : "updated draft",
      target: (p.title as string) ?? "",
    });
    for (const c of port as Array<Record_ & WithTimestamps>) items.push({
      when: c.updatedAt ?? new Date(0),
      who: "Editor",
      action: "updated case study",
      target: `${(c.client as string) ?? ""} — ${(c.title as string) ?? ""}`,
    });
    for (const t of team as Array<Record_ & WithTimestamps>) items.push({
      when: t.updatedAt ?? new Date(0),
      who: "Editor",
      action: "updated team member",
      target: (t.name as string) ?? "",
    });

    items.sort((a, b) => b.when.getTime() - a.when.getTime());
    return items.slice(0, 10).map((x) => ({
      who: x.who,
      action: x.action,
      target: x.target,
      time: relativeTime(x.when),
    }));
  }

  private pctTrend(xs: number[]): number {
    if (xs.length < 2) return 0;
    const last = xs[xs.length - 1] ?? 0;
    const prev = xs[xs.length - 2] ?? 0;
    if (prev === 0 && last === 0) return 0;
    if (prev === 0) return 100;
    return Math.round(((last - prev) / prev) * 1000) / 10;
  }
}

function relativeTime(d: Date): string {
  const ms = Date.now() - d.getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
