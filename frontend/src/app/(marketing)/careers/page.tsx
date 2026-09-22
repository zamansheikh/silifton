import { getCareers } from "@/lib/content";
import { CareersList } from "./careers-list";

export const dynamic = "force-dynamic";

const PERKS: Array<[string, string]> = [
  ["Top-of-band pay", "We pay the 90th-percentile salary for your role and tenure, anywhere you live."],
  ["6-week onboarding", "Paired with a senior engineer. You ship to production in week three."],
  ["Sabbatical at 5 yr", "Three paid months. No expectation to return with a deliverable."],
  ["Conference budget", "$5,000/yr to attend, speak at, or run a conference of your choosing."],
  ["Quarterly offsite", "Four times a year, in cities the team votes on. Family welcome."],
  ["Equity from day one", "Real equity, in cash-flowing entity. Vests over 4 years."],
];

export default async function CareersPage() {
  const careers = await getCareers();

  return (
    <>
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" /> Careers</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(40px, 5.5vw, 80px)" }}>
            Join a team of <em>senior-only</em><br />practitioners.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We hire ~6 people per year. We pay top of band, anywhere you live, and we promote on merit alone.
          </p>
        </div>
      </section>

      <section style={{ padding: "20px 0 100px" }}>
        <div className="wrap">
          <CareersList careers={careers} />

          <div className="grid-3" style={{ marginTop: 80 }}>
            {PERKS.map(([k, v]) => (
              <div key={k} className="card">
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{k}</h4>
                <p style={{ color: "var(--fg-mute)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
