import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleFooter } from "@/components/article-footer";
import { ArticleMarkdown } from "@/components/article-markdown";
import { ArticleToc } from "@/components/article-toc";
import {
  extractArticleHeadings,
  formatTaxonomyLabel,
  getReadingTime,
  getSiteUrl,
} from "@/lib/article-utils";
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
  const canonical =
    metadata.seo.canonical ??
    `${getSiteUrl()}/articles/${metadata.slug}`;

  return {
    title: metadata.seo.title ?? metadata.title,

    description:
      metadata.seo.description ??
      metadata.description,

    alternates: {
      canonical,
    },

    robots: metadata.seo.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,

    openGraph: {
      type: "article",
      title: metadata.seo.title ?? metadata.title,
      description:
        metadata.seo.description ??
        metadata.description,
      url: canonical,
      publishedTime:
        metadata.publishedAt ?? undefined,
      modifiedTime:
        metadata.updatedAt ?? undefined,
      tags: metadata.tags,
    },
  };
}

function relatedScore(
  currentTags: string[],
  currentCategory: string,
  candidateTags: string[],
  candidateCategory: string,
): number {
  let score =
    currentCategory === candidateCategory ? 4 : 0;

  const current = new Set(currentTags);

  for (const tag of candidateTags) {
    if (current.has(tag)) {
      score += 1;
    }
  }

  return score;
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getPublishedArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const { metadata, content } = article;
  const headings = extractArticleHeadings(content);
  const readingTime = getReadingTime(content);

  const seriesArticles = metadata.series
    ? allArticles
        .filter(
          (candidate) =>
            candidate.metadata.series ===
            metadata.series,
        )
        .sort(
          (left, right) =>
            (left.metadata.seriesOrder ?? 9999) -
            (right.metadata.seriesOrder ?? 9999),
        )
    : [];

  const seriesIndex = seriesArticles.findIndex(
    (candidate) =>
      candidate.metadata.slug === metadata.slug,
  );

  const seriesPosition =
    seriesIndex >= 0 ? seriesIndex + 1 : null;

  const seriesSize = seriesArticles.length;

  const previous =
    seriesIndex > 0
      ? seriesArticles[seriesIndex - 1].metadata
      : null;

  const next =
    seriesIndex >= 0 &&
    seriesIndex < seriesArticles.length - 1
      ? seriesArticles[seriesIndex + 1].metadata
      : null;

  const related = allArticles
    .filter(
      (candidate) =>
        candidate.metadata.slug !== metadata.slug,
    )
    .map((candidate) => ({
      metadata: candidate.metadata,
      score: relatedScore(
        metadata.tags,
        metadata.category,
        candidate.metadata.tags,
        candidate.metadata.category,
      ),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((candidate) => candidate.metadata);

  const canonical =
    metadata.seo.canonical ??
    `${getSiteUrl()}/articles/${metadata.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: metadata.title,
    description: metadata.description,
    url: canonical,
    datePublished: metadata.publishedAt ?? undefined,
    dateModified:
      metadata.updatedAt ??
      metadata.publishedAt ??
      undefined,
    author: {
      "@type": "Person",
      name: "Rajshekhar Muchandi",
      url: getSiteUrl(),
    },
    keywords: metadata.tags.join(", "),
    proficiencyLevel: metadata.level,
    about: metadata.architectureTopics,
  };

  return (
    <article className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="shell article-shell">
        <Link
          href="/articles"
          className="article-back"
        >
          ← All articles
        </Link>

        <header className="article-header">
          <div className="article-meta-line">
            <span>
              Category ·{" "}
              {formatTaxonomyLabel(metadata.category)}
            </span>

            <span>
              Level ·{" "}
              {formatTaxonomyLabel(metadata.level)}
            </span>

            <span>
              Evidence ·{" "}
              {formatTaxonomyLabel(
                metadata.evidenceType,
              )}
            </span>

            <span>{readingTime} min read</span>
          </div>

          <h1>{metadata.title}</h1>

          <p className="article-description">
            {metadata.description}
          </p>

          <div className="article-dates">
            {metadata.publishedAt && (
              <span>
                Published · {metadata.publishedAt}
              </span>
            )}

            {metadata.updatedAt && (
              <span>
                Updated · {metadata.updatedAt}
              </span>
            )}

            {metadata.lastVerifiedAt && (
              <span>
                Last verified ·{" "}
                {metadata.lastVerifiedAt}
              </span>
            )}
          </div>

          <div className="article-tags">
            {metadata.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </header>

        <div className="article-layout">
          <div className="article-main">
            <ArticleMarkdown content={content} />

            <ArticleFooter
              current={metadata}
              previous={previous}
              next={next}
              related={related}
              seriesPosition={seriesPosition}
              seriesSize={seriesSize}
            />
          </div>

          <aside className="article-aside">
            <ArticleToc headings={headings} />
          </aside>
        </div>
      </div>
    </article>
  );
}
