import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function CTABand() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)", padding: "120px 0" }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ display: "inline-flex", justifyContent: "center" }}>
          <span className="dot" /> Let&apos;s talk
        </div>
        <h2 className="h2 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5vw, 72px)" }}>
          Have a hard <em>problem</em>?<br />Bring it to us.
        </h2>
        <p className="lead" style={{ margin: "24px auto 0", textAlign: "center" }}>
          We respond to every inquiry within one business day. If the fit isn&apos;t right we&apos;ll tell you, and recommend someone who is.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" href="/contact">
            Start a project <Icon name="arrow" size={16} />
          </Button>
          <Button variant="ghost" size="lg" href="/portfolio">
            See our work
          </Button>
        </div>
      </div>
    </section>
  );
}
