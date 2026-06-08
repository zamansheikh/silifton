import Link from "next/link";
import { getPosts } from "@/lib/content";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  const published = posts.filter((p) => p.status === "Published");
  const [featured, ...rest] = published;

  return (
    <>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Writing</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Field notes <em>from production.</em>
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We publish what we learn. No content marketing, no listicles — just the engineering writeups we&apos;d want to read.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 100 }}>
        <div className="wrap">
          {featured && (
            <Link href={`/blog/${featured.id}`} className="pf-card grid-blog-feature" style={{ marginBottom: 32 }}>
              <div
                className="pf-thumb"
                style={{
                  background: featured.image
                    ? `url(${featured.image}) center/cover`
                    : "linear-gradient(135deg, rgba(79, 139, 255,0.18), rgba(79,123,230,0.1))",
                  aspectRatio: "auto",
                }}
              >
                {!featured.image && (
                  <div className="pf-thumb-bg" style={{ color: "rgba(79, 139, 255,0.25)", fontSize: 280 }}>
                    {featured.title.charAt(0)}
                  </div>
                )}
                {featured.image && (
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%)" }} />
                )}
                <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
                  <span className="tag tag-accent">Featured · {featured.category}</span>
                </div>
              </div>
              <div className="pf-meta" style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {featured.date} · {featured.read} read
                </div>
                <h2 className="h3" style={{ marginTop: 16, fontSize: 28, lineHeight: 1.15 }}>{featured.title}</h2>
                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                    {featured.author.split(" ").map((x) => x[0]).join("")}
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--fg-dim)" }}>{featured.author}</div>
                </div>
              </div>
            </Link>
          )}

          <div className="grid-3">
            {rest.map((p) => (
              <Link key={p.id} href={`/blog/${p.id}`} className="pf-card">
                <div
                  className="pf-thumb"
                  style={{
                    background: p.image
                      ? `url(${p.image}) center/cover`
                      : "linear-gradient(135deg, var(--surface-2), var(--surface-0))",
                    aspectRatio: "16/9",
                  }}
                >
                  {!p.image && (
                    <div className="pf-thumb-bg" style={{ color: "rgba(255,255,255,0.08)" }}>{p.title.charAt(0)}</div>
                  )}
                  {p.image && (
                    <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
                  )}
                  <div style={{ position: "absolute", top: 14, left: 14, zIndex: 1 }}>
                    <span className="tag">{p.category}</span>
                  </div>
                </div>
                <div className="pf-meta">
                  <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {p.date} · {p.read}
                  </div>
                  <h3 className="pf-title" style={{ fontSize: 17 }}>{p.title}</h3>
                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--fg-mute)" }}>{p.author}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
