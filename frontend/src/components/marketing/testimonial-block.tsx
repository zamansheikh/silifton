import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Testimonial } from "@/lib/types";

export function TestimonialBlock({ testimonial }: { testimonial: Testimonial }) {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="grid-split" style={{ alignItems: "center" }}>
          <div>
            <div className="eyebrow"><span className="dot" /> Client letter №01</div>
            <div className="quote-block" style={{ marginTop: 28 }}>“{testimonial.quote}”</div>
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
              {testimonial.avatar ? (
                <div
                  aria-hidden
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `url(${testimonial.avatar}) center/cover`,
                    border: "1px solid var(--border)",
                  }}
                />
              ) : (
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>
                  {testimonial.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 500 }}>{testimonial.author}</div>
                <div style={{ color: "var(--fg-mute)", fontSize: 13 }}>{testimonial.role}</div>
              </div>
            </div>
          </div>
          <div className="panel" style={{ padding: 32 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Outcomes — Meridian Capital
            </div>
            <div className="grid-2" style={{ gap: 28 }}>
              <div><div className="stat-num accent-text">9 mo</div><div className="stat-label">Full replatform</div></div>
              <div><div className="stat-num accent-text">$1.2B</div><div className="stat-label">Daily volume served</div></div>
              <div><div className="stat-num accent-text">−68%</div><div className="stat-label">P99 latency</div></div>
              <div><div className="stat-num accent-text">0</div><div className="stat-label">Incidents in cutover</div></div>
            </div>
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <Link className="btn btn-link" href="/portfolio">
                Read the full case file <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
