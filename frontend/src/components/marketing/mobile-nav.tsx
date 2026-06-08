"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type NavLink = { href: string; label: string };

export function MobileNav({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  useEffect(() => {
    onClose();
    // close when route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="mobile-nav-overlay" role="dialog" aria-modal="true">
      <div className="mobile-nav-overlay-top">
        <Link href="/" className="brand" onClick={onClose}>
          <Image src="/logo.webp" alt="" width={28} height={28} />
          <span>Silifton</span>
        </Link>
        <button className="mobile-nav-toggle" onClick={onClose} aria-label="Close menu">
          <span style={{ display: "inline-block", transform: "rotate(45deg)", lineHeight: 0 }}>
            <Icon name="plus" size={18} />
          </span>
        </button>
      </div>

      <nav className="mobile-nav-links">
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn("mobile-nav-link", active && "active")}
              onClick={onClose}
            >
              <span>{l.label}</span>
              <Icon name="arrow" size={16} />
            </Link>
          );
        })}
      </nav>

      <div className="mobile-nav-footer">
        <Button variant="primary" href="/contact" onClick={onClose}>
          Start a project <Icon name="arrow" size={14} />
        </Button>
      </div>
    </div>
  );
}
