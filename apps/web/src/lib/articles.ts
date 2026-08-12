import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {
  articleMetadataSchema,
  type Article,
  type ArticleMetadata,
} from "@/lib/content-schema";

const ARTICLES_ROOT = path.resolve(
  process.cwd(),
  "../../content/articles",
);

async function walkDirectory(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkDirectory(resolved);
      }

      if (
        entry.isFile() &&
        (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      ) {
        return [resolved];
      }

      return [];
    }),
  );

  return files.flat();
}

async function readArticle(filePath: string): Promise<Article> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  const validation = articleMetadataSchema.safeParse(parsed.data);

  if (!validation.success) {
    const relativePath = path.relative(
      ARTICLES_ROOT,
      filePath,
    );

    console.error(
      `Invalid article metadata: ${relativePath}`,
      validation.error.flatten(),
    );

    throw new Error(
      `Invalid article metadata in ${relativePath}`,
    );
  }

  return {
    metadata: validation.data,
    content: parsed.content.trim(),
    sourcePath: path.relative(ARTICLES_ROOT, filePath),
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const files = await walkDirectory(ARTICLES_ROOT);

  const articles = await Promise.all(
    files.map((file) => readArticle(file)),
  );

  const slugs = new Set<string>();

  for (const article of articles) {
    const slug = article.metadata.slug;

    if (slugs.has(slug)) {
      throw new Error(
        `Duplicate article slug detected: ${slug}`,
      );
    }

    slugs.add(slug);
  }

  return articles.sort((left, right) => {
    const leftDate =
      left.metadata.publishedAt ??
      left.metadata.updatedAt ??
      "0000-00-00";

    const rightDate =
      right.metadata.publishedAt ??
      right.metadata.updatedAt ??
      "0000-00-00";

    return rightDate.localeCompare(leftDate);
  });
}

export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getAllArticles();

  return articles.filter(
    (article) => article.metadata.status === "published",
  );
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const articles = await getPublishedArticles();

  return (
    articles.find(
      (article) => article.metadata.slug === slug,
    ) ?? null
  );
}

export async function getPublishedArticleMetadata(): Promise<
  ArticleMetadata[]
> {
  const articles = await getPublishedArticles();

  return articles.map((article) => article.metadata);
}
