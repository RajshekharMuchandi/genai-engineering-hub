import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleMarkdown } from "@/components/article-markdown";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();

  return articles.map(({ metadata }) => ({
    slug: metadata.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  const { metadata } = article;

  return {
    title: metadata.seo.title ?? metadata.title,

    description:
      metadata.seo.description ??
      metadata.description,

    robots: metadata.seo.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,

    alternates: metadata.seo.canonical
      ? {
          canonical: metadata.seo.canonical,
        }
      : undefined,
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { metadata, content } = article;

  return (
    <article className="article-page">
      <div className="shell article-shell">
        <Link href="/articles" className="article-back">
          ← All articles
        </Link>

        <header className="article-header">
          <div className="article-meta-line">
            <span>{metadata.category}</span>
            <span>{metadata.level}</span>
            <span>{metadata.evidenceType}</span>
          </div>

          <h1>{metadata.title}</h1>

          <p className="article-description">
            {metadata.description}
          </p>

          <div className="article-dates">
            {metadata.publishedAt && (
              <span>
                Published {metadata.publishedAt}
              </span>
            )}

            {metadata.updatedAt && (
              <span>
                Updated {metadata.updatedAt}
              </span>
            )}

            {metadata.lastVerifiedAt && (
              <span>
                Verified {metadata.lastVerifiedAt}
              </span>
            )}
          </div>

          <div className="article-tags">
            {metadata.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        <ArticleMarkdown content={content} />
      </div>
    </article>
  );
}
