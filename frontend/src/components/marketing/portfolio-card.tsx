import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioCard({
  item,
  span = 4,
  layout = "stack",
  large = false,
}: {
  item: PortfolioItem;
  span?: number;
  /** "wide" lays the image beside the text (full-width featured card). */
  layout?: "stack" | "wide";
  large?: boolean;
}) {
  const hasImage = Boolean(item.image);
  const fill = layout === "wide";
  return (
    <Link href={`/portfolio/${item.id}`} className={fill ? "pf-card grid-blog-feature" : "pf-card"} style={{ gridColumn: `span ${fill ? 12 : span}` }}>
      <div
        className="pf-thumb"
        style={{
          ...(hasImage
            ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: `linear-gradient(135deg, ${item.color}26, ${item.color}06)` }),
          ...(fill ? { aspectRatio: "auto", flex: 1, minHeight: 340 } : {}),
        }}
      >
        {!hasImage && (
          <div className="pf-thumb-bg" style={{ color: `${item.color}30`, fontSize: large ? 240 : 160 }}>
            {item.thumb}
          </div>
        )}
        {/* Dark gradient overlay so the tags stay legible against any image */}
        {hasImage && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        )}
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, zIndex: 1 }}>
          <span className="tag" style={{ background: "rgba(0,0,0,0.55)" }}>{item.industry}</span>
          <span className="tag tag-accent">{item.status}</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: hasImage ? "rgba(255,255,255,0.85)" : "var(--fg-mute)",
          }}
        >
          {item.year} · {item.id}
        </div>
      </div>
      <div className="pf-meta" style={fill ? { padding: 36, justifyContent: "center" } : undefined}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {item.client}
          </span>
          <span className="tag tag-accent">{item.metric}</span>
        </div>
        <div className="pf-title" style={large ? { fontSize: 24 } : undefined}>{item.title}</div>
        {item.summary && (
          <p
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "var(--fg-mute)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.summary}
          </p>
        )}
        <div className="pf-footer">
          Read case file <Icon name="arrow" size={14} />
        </div>
      </div>
    </Link>
  );
}
