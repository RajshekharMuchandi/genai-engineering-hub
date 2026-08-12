import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-title">{siteConfig.name}</div>
          <p className="footer-copy">
            Production-oriented GenAI engineering, architecture and
            experimentation.
          </p>
        </div>

        <div>
          <div className="footer-heading">Explore</div>
          <div className="footer-links">
            <Link href="/articles">Articles</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/engineering-labs">Engineering Labs</Link>
            <Link href="/case-studies">Case Studies</Link>
          </div>
        </div>

        <div>
          <div className="footer-heading">Connect</div>
          <div className="footer-links">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <Link href="/work-with-me">Work With Me</Link>
          </div>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>Build → Measure → Explain</span>
      </div>
    </footer>
  );
}
