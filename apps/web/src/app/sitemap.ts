import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/article-utils";
import { getPublishedArticles } from "@/lib/articles";

const STATIC_ROUTES = [
  "",
  "/articles",
  "/projects",
  "/engineering-labs",
  "/case-studies",
  "/solution-blueprints",
  "/expertise",
  "/about",
  "/work-with-me",
];

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const siteUrl = getSiteUrl();
  const articles = await getPublishedArticles();

  const staticEntries: MetadataRoute.Sitemap =
    STATIC_ROUTES.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency:
        route === "/articles" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.7,
    }));

  const articleEntries: MetadataRoute.Sitemap =
    articles.map(({ metadata }) => ({
      url: `${siteUrl}/articles/${metadata.slug}`,
      lastModified:
        metadata.updatedAt ??
        metadata.publishedAt ??
        undefined,
      changeFrequency: "monthly",
      priority: metadata.featured ? 0.9 : 0.8,
    }));

  return [...staticEntries, ...articleEntries];
}
