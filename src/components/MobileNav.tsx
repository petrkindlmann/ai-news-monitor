'use client';

import { useState } from 'react';
import Link from 'next/link';

export type NavKey = 'home' | 'archive' | 'about' | 'subscribe';
export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
}

export function MobileNav({ active, nav }: { active: NavKey; nav: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="mobileNav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <nav className={`mobile-nav${open ? ' open' : ''}`} id="mobileNav" aria-label="Mobile">
        {nav.map(({ key, label, href }) => (
          <Link key={key} href={href} className={key === active ? 'active' : undefined}>
            {label}
          </Link>
        ))}
        <Link href="/subscribe/#rss">RSS Feed</Link>
      </nav>
    </>
  );
}
