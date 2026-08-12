import type { ReactNode } from "react";

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const WORDS_PER_MINUTE = 220;

export function getReadingTime(content: string): number {
  const normalized = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-[\]()]/g, " ")
    .trim();

  const words = normalized ? normalized.split(/\s+/).length : 0;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractArticleHeadings(
  content: string,
): ArticleHeading[] {
  const headings: ArticleHeading[] = [];

  for (const line of content.split(/\r?\n/)) {
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);

    if (!match) {
      continue;
    }

    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    if (!text) {
      continue;
    }

    headings.push({
      id: slugifyHeading(text),
      text,
      level: match[1] === "##" ? 2 : 3,
    });
  }

  return headings;
}

export function reactNodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToText).join("");
  }

  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    node.props &&
    typeof node.props === "object" &&
    "children" in node.props
  ) {
    return reactNodeToText(
      (node.props as { children?: ReactNode }).children,
    );
  }

  return "";
}

export function formatTaxonomyLabel(value: string): string {
  return value
    .split("-")
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1),
    )
    .join(" ");
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}
