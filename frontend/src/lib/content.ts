import { api, ApiError } from "./api";
import { adminAuthHeader } from "./auth-cookie";
import {
  SEED_PORTFOLIO,
  SEED_POSTS,
  SEED_SERVICES,
  SEED_TEAM,
  SEED_TESTIMONIALS,
  SEED_CAREERS,
  SEED_USERS,
  SEED_INQUIRIES,
  SEED_APPLICATIONS,
} from "./seed";
import type {
  Application, Career, Inquiry, PortfolioItem, Post, Service, TeamMember, Testimonial, User,
} from "./types";

async function fetchOrSeed<T>(path: string, seed: T, opts?: { admin?: boolean }): Promise<T> {
  try {
    const headers = opts?.admin ? await adminAuthHeader() : undefined;
    return await api<T>(path, {
      headers,
      cache: "no-store",
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[content] falling back to seed for ${path}:`, (err as ApiError).status ?? err);
    }
    return seed;
  }
}

// Public content (no auth needed)
export const getServices     = () => fetchOrSeed<Service[]>("/content/services", SEED_SERVICES);
export const getPortfolio    = () => fetchOrSeed<PortfolioItem[]>("/content/portfolio", SEED_PORTFOLIO);
export const getPosts        = () => fetchOrSeed<Post[]>("/content/posts", SEED_POSTS);
export const getTeam         = () => fetchOrSeed<TeamMember[]>("/content/team", SEED_TEAM);
export const getTestimonials = () => fetchOrSeed<Testimonial[]>("/content/testimonials", SEED_TESTIMONIALS);
export const getCareers      = () => fetchOrSeed<Career[]>("/content/careers", SEED_CAREERS);

// Admin-only content (cookie → Bearer)
export const getUsers        = () => fetchOrSeed<User[]>("/admin/content/users", SEED_USERS, { admin: true });
export const getInquiries    = () => fetchOrSeed<Inquiry[]>("/inquiries", SEED_INQUIRIES, { admin: true });
export const getApplications = () => fetchOrSeed<Application[]>("/applications", SEED_APPLICATIONS, { admin: true });

// Analytics + activity
export type AnalyticsKpi = {
  label: string;
  value: number;
  total: number;
  trend: number;
  spark: number[];
  color: string;
};
export type AnalyticsOverviewPayload = {
  kpis: AnalyticsKpi[];
  months: string[];
  visitors: number[];
  inquiries: number[];
  sources: Array<{ label: string; value: number; color: string }>;
  activity: Array<{ who: string; action: string; target: string; time: string }>;
};
export type AnalyticsSeriesPayload = {
  months: string[];
  visitors: number[];
  totalLast30: number;
  uniquesLast30: number;
  avgPagesPerVisitor: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number; uniques: number }>;
  topReferrers: Array<{ referrer: string; sessions: number; source: string }>;
  sources: Array<{ label: string; value: number; color: string }>;
};

export const getAnalyticsOverview = () =>
  fetchOrSeed<AnalyticsOverviewPayload>("/analytics/overview", {
    kpis: [], months: [], visitors: [], inquiries: [], sources: [], activity: [],
  }, { admin: true });

export const getAnalyticsSeries = () =>
  fetchOrSeed<AnalyticsSeriesPayload>("/analytics/series", {
    months: [], visitors: [], totalLast30: 0, uniquesLast30: 0,
    avgPagesPerVisitor: 0, bounceRate: 0, topPages: [], topReferrers: [], sources: [],
  }, { admin: true });

// Public site settings (no auth)
export type SiteSettings = Record<string, Record<string, unknown>>;
export const getSiteSettings = () =>
  fetchOrSeed<SiteSettings>("/settings", {} as SiteSettings);
