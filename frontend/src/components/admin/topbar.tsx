"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { getCurrentSectionLabel } from "./sidebar";

export function Topbar({
  user,
  onMenuClick,
}: {
  user: { name: string; email: string; initials: string };
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const label = getCurrentSectionLabel(pathname);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="admin-top">
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button
          type="button"
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Icon name="layers" size={16} />
        </button>
        <div className="admin-crumbs">
          <span>Admin</span>
          <Icon name="chevron" size={12} />
          <span className="now">{label}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="admin-search">
          <Icon name="search" size={14} />
          <input placeholder="Search anything — posts, people, inquiries…" />
          <kbd>⌘K</kbd>
        </div>
        <Link href="/" className="icon-btn" style={{ width: 36, height: 36 }} title="View public site">
          <Icon name="external" size={16} />
        </Link>
        <button className="icon-btn" style={{ width: 36, height: 36, position: "relative" }} title="Notifications">
          <Icon name="bell" size={16} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "var(--accent)", borderRadius: "50%" }} />
        </button>
        <div className="admin-user" style={{ gap: 10 }}>
          <div style={{ textAlign: "right", lineHeight: 1.15 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--fg-mute)" }}>{user.email}</div>
          </div>
          <div className="avatar">{user.initials}</div>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="icon-btn"
            style={{ width: 36, height: 36, opacity: loggingOut ? 0.5 : 1 }}
            title="Sign out"
          >
            <Icon name="external" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
