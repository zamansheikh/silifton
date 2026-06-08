import type { MetadataRoute } from "next";
import { getPortfolio, getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

// Regenerate periodically so newly published posts / case files show up.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1.0, freq: "daily" },
    { path: "/services", priority: 0.8, freq: "monthly" },
    { path: "/portfolio", priority: 0.8, freq: "weekly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/careers", priority: 0.7, freq: "weekly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
    { path: "/security", priority: 0.4, freq: "yearly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [portfolio, posts] = await Promise.all([getPortfolio(), getPosts()]);
    const portfolioEntries: MetadataRoute.Sitemap = portfolio.map((item) => ({
      url: absoluteUrl(`/portfolio/${item.id}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    const postEntries: MetadataRoute.Sitemap = posts
      .filter((p) => p.status === "Published")
      .map((p) => ({
        url: absoluteUrl(`/blog/${p.id}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    dynamicEntries = [...portfolioEntries, ...postEntries];
  } catch {
    // If content can't be fetched at build time, ship the static routes alone.
  }

  return [...staticEntries, ...dynamicEntries];
}
