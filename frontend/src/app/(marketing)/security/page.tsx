import { LegalPage } from "@/components/marketing/legal-page";

export const metadata = { title: "Security — Silifton" };

export default function Security() {
  return (
    <LegalPage
      eyebrow="Legal · Security"
      title="How we protect client work."
      effective="May 17, 2026"
      sections={[
        {
          heading: "Data handling",
          body: [
            "Client production data never leaves the client&apos;s environment. We work against client-owned infrastructure under credentials they provision and revoke.",
            "Admin records, inquiries, and applications are stored in MongoDB Atlas with at-rest encryption and TLS in transit.",
          ],
        },
        {
          heading: "Access control",
          body: [
            "Admin access uses email + password with bcrypt hashing and JWT-signed session cookies. We require all team members to enable 2FA on their email and identity providers.",
            "Least-privilege roles are enforced — Owner, Admin, Editor, Author, Viewer — with auditable role changes.",
          ],
        },
        {
          heading: "Disclosure",
          body: [
            "If you believe you have found a security issue, please email security@silifton.com. We aim to acknowledge within 24 hours and provide a fix or mitigation within 5 business days for high-severity issues.",
          ],
        },
        {
          heading: "Audit",
          body: [
            "We undergo SOC 2 Type II auditing annually. Reports are available under NDA on request.",
          ],
        },
      ]}
    />
  );
}
