import { api, ApiError } from "./api";
import {
  SEED_PORTFOLIO,
  SEED_POSTS,
  SEED_SERVICES,
  SEED_TEAM,
  SEED_TESTIMONIALS,
  SEED_CAREERS,
} from "./seed";
import type { Career, PortfolioItem, Post, Service, TeamMember, Testimonial } from "./types";

// Public content for the marketing site. Served by the CRM API
// (NEXT_PUBLIC_API_URL) and edited from the CRM's "Website" section.
// Falls back to the bundled seed so the site still renders if the API is down.
async function fetchOrSeed<T>(path: string, seed: T): Promise<T> {
  try {
    return await api<T>(path, { cache: "no-store" });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[content] falling back to seed for ${path}:`, (err as ApiError).status ?? err);
    }
    return seed;
  }
}

export const getServices     = () => fetchOrSeed<Service[]>("/content/services", SEED_SERVICES);
export const getPortfolio    = () => fetchOrSeed<PortfolioItem[]>("/content/portfolio", SEED_PORTFOLIO);
export const getPosts        = () => fetchOrSeed<Post[]>("/content/posts", SEED_POSTS);
export const getTeam         = () => fetchOrSeed<TeamMember[]>("/content/team", SEED_TEAM);
export const getTestimonials = () => fetchOrSeed<Testimonial[]>("/content/testimonials", SEED_TESTIMONIALS);
export const getCareers      = () => fetchOrSeed<Career[]>("/content/careers", SEED_CAREERS);

// Public site settings (hero, about, footer, social, seo).
export type SiteSettings = Record<string, Record<string, unknown>>;
export const getSiteSettings = () =>
  fetchOrSeed<SiteSettings>("/settings", {} as SiteSettings);
