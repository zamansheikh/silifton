"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MobileNav } from "./mobile-nav";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export function TopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="topnav">
        <div className="wrap topnav-inner">
          <Link className="brand" href="/">
            <Image src="/logo.webp" alt="" width={28} height={28} priority />
            <span>Silifton</span>
            <span className="brand-mark">EST. 2019</span>
          </Link>
          <nav className="nav-links">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href} className={cn("nav-link", active && "active")}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="nav-actions">
            <Button variant="primary" size="sm" href="/contact">
              Start a project <Icon name="arrow" size={13} />
            </Button>
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Icon name="layers" size={18} />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
    </>
  );
}
