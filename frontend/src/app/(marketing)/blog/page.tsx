import Link from "next/link";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Post } from "@/lib/types";

export const metadata = buildMetadata({
  title: "Field notes",
  description:
    "Field notes on shipping production software — engineering, design, AI, and how we run our delivery cadence.",
  path: "/blog",
});

export const revalidate = 60;

function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.id}`} className="pf-card">
      <div
        className="pf-thumb"
        style={{
          background: p.image ? `url(${p.image}) center/cover` : "linear-gradient(135deg, var(--surface-2), var(--surface-0))",
          aspectRatio: "16/9",
        }}
      >
        {!p.image && <div className="pf-thumb-bg" style={{ color: "rgba(255,255,255,0.08)" }}>{p.title.charAt(0)}</div>}
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
        <h3 className="pf-title" style={{ fontSize: 18 }}>{p.title}</h3>
        {p.excerpt && (
          <p className="pf-sub" style={{ marginTop: 4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>
        )}
        <div className="pf-footer" style={{ color: "var(--fg-mute)", fontWeight: 400 }}>{p.author}</div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();
  const published = posts.filter((p) => p.status === "Published");
  // Latest post runs full width with the image beside the text; then a row of
  // three and a row of two (any further posts continue in twos).
  const [featured, ...rest] = published;
  const rowOfThree = rest.slice(0, 3);
  const remaining = rest.slice(3);

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
            <Link href={`/blog/${featured.id}`} className="pf-card grid-blog-feature" style={{ marginBottom: 24 }}>
              <div
                className="pf-thumb"
                style={{
                  aspectRatio: "16/10",
                  background: featured.image ? `url(${featured.image}) center/cover` : "linear-gradient(135deg, var(--surface-2), var(--surface-0))",
                }}
              >
                {featured.image && (
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 45%)" }} />
                )}
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>
                  <span className="tag" style={{ background: "rgba(0,0,0,0.55)" }}>{featured.category}</span>
                </div>
              </div>
              <div className="pf-meta" style={{ padding: 36, justifyContent: "center" }}>
                <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Latest · {featured.date} · {featured.read} read
                </div>
                <h2 className="pf-title" style={{ fontSize: 28, lineHeight: 1.15, marginTop: 14 }}>{featured.title}</h2>
                {featured.excerpt && <p className="pf-sub" style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6 }}>{featured.excerpt}</p>}
                <div className="pf-footer" style={{ color: "var(--fg-mute)", fontWeight: 400 }}>{featured.author}</div>
              </div>
            </Link>
          )}

          <div className="grid-3">
            {rowOfThree.map((p) => <PostCard key={p.id} p={p} />)}
          </div>

          {remaining.length > 0 && (
            <div className="grid-2" style={{ marginTop: 24 }}>
              {remaining.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
