import Image from "next/image";
import Link from "next/link";

export type FooterContent = {
  tagline?: string;
  address?: string;
  email?: string;
  copyright?: string;
  social?: { twitter?: string; linkedin?: string; github?: string; youtube?: string };
};

const DEFAULTS = {
  tagline: "A senior-only engineering studio for fintech, health and AI-native products. Engineered in Dhaka, London and Lagos.",
  address: "Dhaka · London · Lagos",
  email: "hello@silifton.com",
  copyright: `© ${new Date().getFullYear()} Silifton Ltd. All rights reserved.`,
};

export function Footer({ content }: { content?: FooterContent }) {
  const c = { ...DEFAULTS, ...(content ?? {}) };
  const social = content?.social ?? {};
  const offices = c.address.split(/[·•|]/).map((s) => s.trim()).filter(Boolean);

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 20 }}>
              <Image src="/logo.webp" alt="" width={28} height={28} />
              <span>Silifton</span>
            </div>
            <p style={{ color: "var(--fg-mute)", fontSize: 14, maxWidth: 360, lineHeight: 1.6 }}>
              {c.tagline}
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 24, color: "var(--fg-mute)", fontSize: 13, flexWrap: "wrap" }}>
              <span><span className="accent-text">●</span> All systems operational</span>
              <span className="mono">v0.1.0</span>
            </div>
            {(social.twitter || social.linkedin || social.github || social.youtube) && (
              <div style={{ marginTop: 18, display: "flex", gap: 12, fontSize: 13 }}>
                {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {social.github && <a href={social.github} target="_blank" rel="noreferrer">GitHub</a>}
                {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer">YouTube</a>}
              </div>
            )}
          </div>
          <div className="footer-col">
            <h5>Studio</h5>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/portfolio">Case files</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Writing</h5>
            <ul>
              <li><Link href="/blog">Field notes</Link></li>
              <li><Link href="/blog?category=Engineering">Engineering</Link></li>
              <li><Link href="/blog?category=Design">Design</Link></li>
              <li><a href="/rss.xml">RSS feed</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><Link href="/contact">Start a project</Link></li>
              <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
              <li><a href="mailto:press@silifton.com">Press inquiries</a></li>
              <li><a href="mailto:careers@silifton.com">Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Offices</h5>
            <ul>
              {offices.length > 0 ? offices.map((o) => (
                <li key={o}><span>{o}</span></li>
              )) : <li><span>{c.address}</span></li>}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{c.copyright}</span>
          <span>
            <Link href="/privacy" style={{ marginRight: 24 }}>Privacy</Link>
            <Link href="/terms" style={{ marginRight: 24 }}>Terms</Link>
            <Link href="/security">Security</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
