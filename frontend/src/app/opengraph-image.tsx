import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

// Default social-share card for every route that doesn't supply its own image.
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function OpengraphImage() {
  const [name, tagline] = siteConfig.title.split(/\s+—\s+/, 2);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `radial-gradient(1200px 600px at 15% -10%, ${hexToRgba(siteConfig.accent, 0.22)}, transparent 60%), #07090c`,
          color: "#f2f5f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: siteConfig.accent }} />
          <div style={{ fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#8b95a3" }}>
            Senior engineering studio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 34, color: "#c4ccd6", maxWidth: 900, lineHeight: 1.3 }}>
            {tagline ?? siteConfig.description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#8b95a3" }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: siteConfig.accent }} />
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
