"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; initials: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      return () => document.body.classList.remove("no-scroll");
    }
  }, [open]);

  return (
    <div className="admin">
      <Sidebar open={open} />
      <div
        className={`admin-side-backdrop${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <main className="admin-main">
        <Topbar user={user} onMenuClick={() => setOpen((v) => !v)} />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
