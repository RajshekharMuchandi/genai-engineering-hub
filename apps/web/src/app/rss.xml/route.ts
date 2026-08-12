import { getSiteUrl } from "@/lib/article-utils";
import { getPublishedArticles } from "@/lib/articles";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const articles = await getPublishedArticles();

  const items = articles
    .map(({ metadata }) => {
      const url = `${siteUrl}/articles/${metadata.slug}`;
      const date = metadata.publishedAt
        ? new Date(
            `${metadata.publishedAt}T00:00:00Z`,
          ).toUTCString()
        : "";

      return `
        <item>
          <title>${escapeXml(metadata.title)}</title>
          <link>${escapeXml(url)}</link>
          <guid>${escapeXml(url)}</guid>
          <description>${escapeXml(
            metadata.description,
          )}</description>
          ${
            date
              ? `<pubDate>${escapeXml(date)}</pubDate>`
              : ""
          }
        </item>
      `.trim();
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Rajshekhar Muchandi — GenAI Engineering</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Production-oriented GenAI architecture, RAG, agents, evaluation, LLMOps and enterprise AI engineering.</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type":
        "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600",
    },
  });
}
