import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import type { Service } from "@/lib/types";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head-l">
            <div className="eyebrow"><span className="dot" /> Capabilities</div>
            <h2 className="h2 display-mix" style={{ marginTop: 16 }}>
              Six disciplines, <em>one team</em>,<br />shipping in lockstep.
            </h2>
          </div>
          <div style={{ maxWidth: 320, color: "var(--fg-mute)", fontSize: 14 }}>
            Each engagement is staffed end-to-end. No handoffs between agencies. No translation losses.
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-link" href="/services">
                Full capability matrix <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="svc-grid">
          {services.map((s) => (
            <div key={s.num} className="svc-cell">
              <div className="svc-num">{s.num} ——</div>
              <div className="svc-icon"><Icon name={s.icon as IconName} size={20} /></div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
