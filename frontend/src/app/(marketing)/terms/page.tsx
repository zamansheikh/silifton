import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that govern use of this website and its content.",
  path: "/terms",
});

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal · Terms"
      title="Terms of use."
      effective="May 17, 2026"
      sections={[
        {
          heading: "1. Use of the site",
          body: [
            "This website and its content are provided for informational purposes. By accessing the site you agree not to attempt to gain unauthorised access, interfere with its operation, or scrape it at a rate that degrades service for other users.",
          ],
        },
        {
          heading: "2. Engagements & quotes",
          body: [
            "Nothing on this site constitutes a binding offer of services. Engagements are governed by a separate Master Services Agreement signed by both parties.",
            "Quoted ranges in budget selectors are indicative. Final pricing is established during scoping.",
          ],
        },
        {
          heading: "3. Intellectual property",
          body: [
            "All site content, including text, design and code samples, is © 2026 Silifton Ltd. You may quote with attribution; you may not redistribute substantial portions without permission.",
          ],
        },
        {
          heading: "4. Liability",
          body: [
            "The site is provided 'as is' without warranty of any kind. We are not liable for any indirect or consequential loss arising from your use of it.",
          ],
        },
      ]}
    />
  );
}
