import type { Metadata } from "next";
import Link from "next/link";

import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "GenAI Engineering Articles",
  description:
    "Production-oriented engineering articles covering RAG, AI agents, evaluation, security, LLMOps and enterprise GenAI architecture.",
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="section">
      <div className="shell">
        <div className="page-intro">
          <div className="eyebrow">KNOWLEDGE BASE</div>

          <h1>GenAI Engineering Articles</h1>

          <p>
            Architecture, implementation, experimentation,
            evaluation and production lessons for building
            dependable Generative AI systems.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="empty-state">
            <strong>No published articles yet.</strong>

            <p>
              Drafts remain private until their metadata status
              is changed to published.
            </p>
          </div>
        ) : (
          <div className="article-list">
            {articles.map(({ metadata }) => (
              <article
                className="article-list-item"
                key={metadata.slug}
              >
                <div className="article-meta-line">
                  <span>{metadata.category}</span>

                  <span>{metadata.level}</span>

                  {metadata.publishedAt && (
                    <time dateTime={metadata.publishedAt}>
                      {metadata.publishedAt}
                    </time>
                  )}
                </div>

                <h2>
                  <Link
                    href={`/articles/${metadata.slug}`}
                  >
                    {metadata.title}
                  </Link>
                </h2>

                <p>{metadata.description}</p>

                <div className="article-tags">
                  {metadata.tags.slice(0, 5).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <Link
                  className="text-link"
                  href={`/articles/${metadata.slug}`}
                >
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
