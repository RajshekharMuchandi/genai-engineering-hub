import Link from "next/link";

import type { ArticleMetadata } from "@/lib/content-schema";

interface ArticleFooterProps {
  current: ArticleMetadata;
  previous: ArticleMetadata | null;
  next: ArticleMetadata | null;
  related: ArticleMetadata[];
}

export function ArticleFooter({
  current,
  previous,
  next,
  related,
}: ArticleFooterProps) {
  return (
    <footer className="article-footer">
      {current.series && (
        <section className="article-series-card">
          <div className="article-footer-eyebrow">
            SERIES
          </div>

          <strong>{current.series}</strong>

          {current.seriesOrder && (
            <span>
              Article {current.seriesOrder} in this series
            </span>
          )}
        </section>
      )}

      {(previous || next) && (
        <nav
          className="article-pagination"
          aria-label="Series navigation"
        >
          <div>
            {previous && (
              <Link
                href={`/articles/${previous.slug}`}
              >
                <span>← Previous</span>
                <strong>{previous.title}</strong>
              </Link>
            )}
          </div>

          <div className="article-pagination-next">
            {next && (
              <Link href={`/articles/${next.slug}`}>
                <span>Next →</span>
                <strong>{next.title}</strong>
              </Link>
            )}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section className="related-articles">
          <div className="article-footer-eyebrow">
            CONTINUE EXPLORING
          </div>

          <h2>Related articles</h2>

          <div className="related-article-grid">
            {related.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
              >
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <p>{article.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="article-author-card">
        <div className="article-author-mark">RM</div>

        <div>
          <div className="article-footer-eyebrow">
            AUTHOR
          </div>

          <h2>Rajshekhar Muchandi</h2>

          <p>
            Enterprise software engineer focused on
            production-grade Generative AI architecture,
            RAG, agents, evaluation, LLMOps, security and
            distributed systems.
          </p>
        </div>
      </section>

      <section className="article-cta">
        <div>
          <div className="article-footer-eyebrow">
            HAVE A GENAI PROBLEM?
          </div>

          <h2>
            Start with the engineering problem, not the
            model.
          </h2>

          <p>
            Explore architecture, RAG, agents, evaluation
            and production-readiness options for your use
            case.
          </p>
        </div>

        <Link
          href="/work-with-me"
          className="button button-primary"
        >
          Work With Me
        </Link>
      </section>
    </footer>
  );
}
