import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.id === slug);
  if (!post || post.status !== "Published") {
    return buildMetadata({ title: "Post not found", path: `/blog/${slug}`, noIndex: true });
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? `${post.category} · ${post.author} · ${post.read} read`,
    path: `/blog/${post.id}`,
    image: post.image,
    type: "article",
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.id === slug);
  if (!post) notFound();

  // Only show published posts to the public (admin can read drafts via /admin/blog).
  if (post.status !== "Published") notFound();

  const paragraphs = (post.body ?? "").split("\n\n").filter(Boolean);
  const initials = post.author.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const related = posts
    .filter((p) => p.id !== post.id && p.status === "Published" && p.category === post.category)
    .slice(0, 3);

  return (
    <article>
      <section className="section" style={{ paddingTop: 60, paddingBottom: 32 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Link href="/blog" className="btn btn-link" style={{ marginBottom: 16 }}>
            ← All field notes
          </Link>
          <div className="eyebrow" style={{ marginTop: 16 }}>
            <span className="dot" /> {post.category}
          </div>
          <h1
            className="h1 display-mix"
            style={{ marginTop: 24, fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.08 }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="lead" style={{ marginTop: 20, fontSize: 19 }}>
              {post.excerpt}
            </p>
          )}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingBottom: 28,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{post.author}</div>
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: "var(--fg-mute)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {post.date} · {post.read} read
              </div>
            </div>
          </div>
        </div>
      </section>

      {post.image && (
        <section style={{ padding: "0 0 40px" }}>
          <div className="wrap" style={{ maxWidth: 960 }}>
            <div
              aria-hidden
              style={{
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 12,
                background: `url(${post.image}) center/cover`,
                border: "1px solid var(--border)",
              }}
            />
          </div>
        </section>
      )}

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: "var(--fg-dim)",
                  marginBottom: 24,
                }}
              >
                {para}
              </p>
            ))
          ) : (
            <p style={{ color: "var(--fg-mute)", fontStyle: "italic" }}>
              This post has no body content yet — add it through the admin panel.
            </p>
          )}

          <div
            style={{
              marginTop: 56,
              paddingTop: 28,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {post.id} · {post.views.toLocaleString()} views
            </div>
            <Button variant="primary" href="/contact">
              Start a project <Icon name="arrow" size={14} />
            </Button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="section-head">
              <div className="section-head-l">
                <div className="eyebrow"><span className="dot" /> Keep reading</div>
                <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
                  More from <em>{post.category}</em>.
                </h2>
              </div>
              <Link className="btn btn-ghost" href="/blog">
                All field notes <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div className="grid-3">
              {related.map((p) => (
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
                      <div className="pf-thumb-bg" style={{ color: "rgba(255,255,255,0.08)" }}>
                        {p.title.charAt(0)}
                      </div>
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
                    <div className="pf-footer">
                      Read <Icon name="arrow" size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
