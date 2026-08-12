import { z } from "zod";

const dateField = z.preprocess(
  (value) => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return value;
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
    .nullish(),
);

export const articleMetadataSchema = z
  .strictObject({
    title: z.string().min(5),
    slug: z
      .string()
      .min(3)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must use lowercase kebab-case",
      ),

    description: z.string().min(30).max(300),

    contentType: z.literal("article"),

    status: z.enum([
      "idea",
      "draft",
      "review",
      "published",
      "archived",
    ]),

    category: z.enum([
      "foundations",
      "rag",
      "agents",
      "mcp",
      "a2a",
      "evaluation",
      "llmops",
      "security",
      "enterprise-architecture",
      "multimodal",
      "model-engineering",
      "solution-blueprints",
    ]),

    series: z.string().min(1).nullish(),
    seriesOrder: z.number().int().positive().nullish(),

    level: z.enum([
      "foundation",
      "intermediate",
      "advanced",
      "expert",
    ]),

    evidenceType: z.enum([
      "production-experience",
      "reference-implementation",
      "engineering-lab",
      "architecture-blueprint",
      "research-analysis",
    ]),

    tags: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    architectureTopics: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),

    publishedAt: dateField,
    updatedAt: dateField,
    lastVerifiedAt: dateField,

    featured: z.boolean().default(false),

    github: z.string().url().nullish(),
    demo: z.string().url().nullish(),

    seo: z
      .strictObject({
        title: z.string().nullish(),
        description: z.string().nullish(),
        canonical: z.string().url().nullish(),
        noindex: z.boolean().default(false),
      })
      .default({
        title: null,
        description: null,
        canonical: null,
        noindex: false,
      }),
  })
  .superRefine((metadata, context) => {
    if (metadata.status === "published" && !metadata.publishedAt) {
      context.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "Published articles require publishedAt",
      });
    }

    if (metadata.seriesOrder && !metadata.series) {
      context.addIssue({
        code: "custom",
        path: ["seriesOrder"],
        message: "seriesOrder requires series",
      });
    }
  });

export type ArticleMetadata = z.infer<typeof articleMetadataSchema>;

export interface Article {
  metadata: ArticleMetadata;
  content: string;
  sourcePath: string;
}
