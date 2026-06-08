import type { Metadata } from "next";

// ── Central site config ───────────────────────────────────────────────────
// This is the ONLY brand-specific SEO file. Every other SEO file (layout,
// sitemap, robots, manifest, opengraph-image) reads from here, so the SEO
// logic stays identical across sister projects — only these values differ.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://silifton.com").replace(/\/+$/, "");

export const siteConfig = {
  name: "Silifton",
  title: "Silifton — Senior engineering studio",
  description:
    "A senior-only engineering studio for fintech, health, and AI-native products. We embed senior squads to ship production software from zero to scale.",
  url: SITE_URL,
  locale: "en_US",
  accent: "#4f8bff",
  twitter: "@silifton",
  keywords: [
    "software engineering studio",
    "senior engineers",
    "fintech development",
    "healthtech software",
    "AI product development",
    "product engineering",
    "cloud platform",
    "Next.js development",
    "staff augmentation",
  ],
} as const;

/** Turn a root-relative path into an absolute URL on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

type BuildMetaOptions = {
  title?: string;
  description?: string;
  /** Canonical path, e.g. "/about". Defaults to "/". */
  path?: string;
  /** Absolute or root-relative image. Omit to use the site default OG image. */
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  authors?: string[];
};

/**
 * Per-page metadata with SEO defaults baked in: canonical URL, Open Graph and
 * Twitter cards. `title` is fed through the root title template (`%s — Brand`).
 * When `image` is omitted the route falls back to the generated opengraph-image.
 */
export function buildMetadata(opts: BuildMetaOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "/",
    image,
    type = "website",
    noIndex = false,
    publishedTime,
    authors,
  } = opts;

  const url = absoluteUrl(path);
  const img = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title: title ?? siteConfig.title,
      description,
      locale: siteConfig.locale,
      ...(img ? { images: [{ url: img, alt: title ?? siteConfig.name }] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.title,
      description,
      ...(img ? { images: [img] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
