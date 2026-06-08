"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/icon";

type Item = { href: string; label: string; icon: IconName; count?: number; badge?: "live" };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Workspace",
    items: [
      { href: "/admin", label: "Overview", icon: "home" },
      { href: "/admin/analytics", label: "Analytics", icon: "chart" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/services", label: "Services", icon: "bolt", count: 6 },
      { href: "/admin/portfolio", label: "Portfolio", icon: "layers", count: 18 },
      { href: "/admin/blog", label: "Blog posts", icon: "fileText", count: 24 },
      { href: "/admin/testimonials", label: "Testimonials", icon: "star", count: 12 },
      { href: "/admin/site", label: "Site settings", icon: "globe" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/team", label: "Team", icon: "users", count: 38 },
      { href: "/admin/careers", label: "Job openings", icon: "briefcase", count: 5 },
      { href: "/admin/applications", label: "Applications", icon: "fileText", count: 47, badge: "live" },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/inquiries", label: "Inquiries", icon: "mail", count: 7, badge: "live" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Users & roles", icon: "shield" },
      { href: "/admin/settings", label: "Workspace settings", icon: "settings" },
    ],
  },
];

export function Sidebar({ open = false }: { open?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={cn("admin-side", open && "open")}>
      <div className="side-brand">
        <Image src="/logo.webp" alt="Silifton" width={26} height={26} />
        <div>
          <div className="side-brand-name">Silifton</div>
          <div style={{ fontSize: 11, color: "var(--fg-faint)" }}>Admin · v0.1</div>
        </div>
        <div className="side-brand-mark">TS</div>
      </div>

      {GROUPS.map((g) => (
        <div key={g.label} className="side-group">
          <div className="side-group-label">{g.label}</div>
          {g.items.map((it) => {
            const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} className={cn("side-item", active && "active")}>
                <Icon name={it.icon} />
                <span>{it.label}</span>
                {it.count !== undefined && (
                  <span className={cn("side-badge", it.badge === "live" && "live")}>{it.count}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 24, padding: 14, background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px rgba(79, 139, 255,0.2)" }} />
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>All systems normal</span>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--fg-mute)", fontFamily: "var(--font-mono)" }}>API 12ms · DB 4ms · CDN ✓</div>
      </div>
    </aside>
  );
}

export function getCurrentSectionLabel(pathname: string): string {
  for (const g of GROUPS) {
    for (const it of g.items) {
      if (it.href === "/admin" && pathname === "/admin") return it.label;
      if (it.href !== "/admin" && pathname.startsWith(it.href)) return it.label;
    }
  }
  return "Overview";
}
