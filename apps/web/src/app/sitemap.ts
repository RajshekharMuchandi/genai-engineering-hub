import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/article-utils";
import { getPublishedArticles } from "@/lib/articles";
import { getAllLabs } from "@/lib/labs";

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

  const [articles, labs] = await Promise.all([
    getPublishedArticles(),
    getAllLabs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap =
    STATIC_ROUTES.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency:
        route === "/articles" ||
        route === "/engineering-labs"
          ? "weekly"
          : "monthly",
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

  const labEntries: MetadataRoute.Sitemap =
    labs.map(({ metadata, evidence }) => ({
      url: `${siteUrl}/engineering-labs/${metadata.slug}`,
      lastModified: evidence.verifiedAt,
      changeFrequency: "monthly",
      priority: metadata.featured ? 0.9 : 0.8,
    }));

  return [
    ...staticEntries,
    ...articleEntries,
    ...labEntries,
  ];
}
