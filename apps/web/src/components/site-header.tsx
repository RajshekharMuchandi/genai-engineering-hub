import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { mainNavigation, siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">RM</span>

          <span className="brand-copy">
            <strong>{siteConfig.name}</strong>
            <span>{siteConfig.title}</span>
          </span>
        </Link>

        <nav
          className="primary-nav"
          aria-label="Primary navigation"
        >
          {mainNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.title}
            </Link>
          ))}
        </nav>

        <Link
          href="/work-with-me"
          className="header-cta"
        >
          Work With Me
        </Link>

        <MobileNav />
      </div>
    </header>
  );
}
