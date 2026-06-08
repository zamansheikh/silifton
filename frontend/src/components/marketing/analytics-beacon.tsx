"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Tiny first-party tracker. Fires once per pathname change against
 * /api/proxy/analytics/track. No cookies, no consent banner needed —
 * the server bucketizes by hashed IP+UA+day.
 */
export function AnalyticsBeacon() {
  const path = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!path) return;
    if (last.current === path) return;
    last.current = path;

    // Use sendBeacon when we can — it survives page transitions. Fall back
    // to fetch with keepalive otherwise.
    const body = JSON.stringify({ path, referrer: document.referrer || "" });
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/track", blob);
        return;
      }
    } catch { /* fall through to fetch */ }

    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [path]);

  return null;
}
