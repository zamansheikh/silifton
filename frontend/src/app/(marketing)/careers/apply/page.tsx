import { ApplyForm } from "./apply-form";
import { getCareers } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Apply",
  description: "Apply to an open role at our senior-only engineering studio.",
  path: "/careers/apply",
});

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const [careers, sp] = await Promise.all([getCareers(), searchParams]);
  const open = careers.filter((c) => c.status === "Open");
  const role = open.find((c) => c.id === sp.role) ?? open[0];

  return (
    <>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="eyebrow"><span className="dot" /> Careers · Apply</div>
          <h1 className="h1 display-mix" style={{ marginTop: 24, fontSize: "clamp(36px, 4.5vw, 64px)" }}>
            Let&apos;s talk about <em>{role?.title ?? "the role"}</em>.
          </h1>
          <p className="lead" style={{ marginTop: 20 }}>
            We respond to every application within five business days. Senior referrals are
            prioritised, but the bar is the same.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 120 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <ApplyForm roles={open} initialRoleId={role?.id ?? ""} />
        </div>
      </section>
    </>
  );
}
