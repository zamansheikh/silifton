import { LegalPage } from "@/components/marketing/legal-page";

export const metadata = { title: "Privacy — Silifton" };

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal · Privacy"
      title="How we handle your data."
      effective="May 17, 2026"
      sections={[
        {
          heading: "1. What we collect",
          body: [
            "When you contact us through the website, we collect your name, company, email, budget range, and the message body. When you apply for a role we additionally collect your CV links and source attribution.",
            "We use server logs to record IP addresses and user-agents for abuse prevention. These logs are retained for 30 days.",
          ],
        },
        {
          heading: "2. How we use it",
          body: [
            "Inbound inquiries and applications are reviewed by a human within one business day and stored in our admin system. We do not use them to train any machine-learning model.",
            "We use the email you provide to reply to your message. We do not add you to any newsletter without an explicit opt-in.",
          ],
        },
        {
          heading: "3. Third parties",
          body: [
            "We use Resend to deliver transactional email notifications. We use MongoDB Atlas to store admin records. Both providers act as data processors under our instructions.",
            "We do not run third-party analytics, retargeting pixels, or session-replay tools on this site.",
          ],
        },
        {
          heading: "4. Your rights",
          body: [
            "You can request a copy of, correction to, or deletion of any record we hold about you by emailing privacy@silifton.com. We will respond within 14 days.",
          ],
        },
      ]}
    />
  );
}
