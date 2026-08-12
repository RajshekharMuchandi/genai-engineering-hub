"use client";

import Link from "next/link";
import { useState } from "react";

import { mainNavigation } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-trigger"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Menu</span>
        <span aria-hidden="true">
          {open ? "×" : "☰"}
        </span>
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav-panel"
          aria-label="Mobile navigation"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}

          <Link
            href="/work-with-me"
            className="mobile-nav-cta"
            onClick={() => setOpen(false)}
          >
            Work With Me
          </Link>
        </nav>
      )}
    </div>
  );
}
