"use client";

import { useEffect, useState } from "react";

import type { ArticleHeading } from "@/lib/article-utils";

interface ArticleTocProps {
  headings: ArticleHeading[];
}

export function ArticleToc({
  headings,
}: ArticleTocProps) {
  const [activeId, setActiveId] = useState(
    headings[0]?.id ?? "",
  );

  useEffect(() => {
    const elements = headings
      .map((heading) =>
        document.getElementById(heading.id),
      )
      .filter(
        (element): element is HTMLElement =>
          element !== null,
      );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top -
              right.boundingClientRect.top,
          );

        const first = visible[0]?.target;

        if (first instanceof HTMLElement) {
          setActiveId(first.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className="article-toc"
      aria-label="Table of contents"
    >
      <div className="article-toc-title">
        On this page
      </div>

      <ol>
        {headings.map((heading) => (
          <li
            key={`${heading.level}-${heading.id}`}
            className={
              heading.level === 3
                ? "article-toc-subitem"
                : undefined
            }
          >
            <a
              href={`#${heading.id}`}
              className={
                activeId === heading.id
                  ? "is-active"
                  : undefined
              }
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
