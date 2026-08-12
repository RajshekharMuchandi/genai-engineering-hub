import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const LABS_ROOT = path.resolve(
  process.cwd(),
  "../../engineering-labs",
);

const labMetadataSchema = z.strictObject({
  id: z.string().regex(/^LAB-\d{3}$/),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  description: z.string().min(40),
  researchQuestion: z.string().min(20),
  hypothesis: z.string().min(20),
  status: z.enum([
    "planned",
    "running",
    "verified",
    "archived",
  ]),
  level: z.enum([
    "foundation",
    "intermediate",
    "advanced",
    "expert",
  ]),
  evidenceType: z.literal("engineering-lab"),
  category: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  externalApiUsed: z.boolean(),
  credentialsRequired: z.boolean(),
  companionArticleSlug: z.string().nullish(),
  github: z.string().url(),
  reproductionCommands: z.array(z.string()).min(1),
  testAreas: z.array(z.string()).min(1),
  limitations: z.array(z.string()).default([]),
  nextExperiments: z.array(z.string()).default([]),
  lastVerifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish(),
});

const labEvidenceSchema = z.strictObject({
  labId: z.string().regex(/^LAB-\d{3}$/),
  status: z.enum(["verified", "failed"]),
  testsRun: z.number().int().nonnegative(),
  passed: z.number().int().nonnegative(),
  failures: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  allPassed: z.boolean(),
  minimumRequiredTests: z.number().int().positive(),
  externalApiUsed: z.boolean(),
  credentialsRequired: z.boolean(),
  pythonVersion: z.string().min(1),
  verifiedAt: z.string().datetime({ offset: true }),
});

export type LabMetadata = z.infer<
  typeof labMetadataSchema
>;

export type LabEvidence = z.infer<
  typeof labEvidenceSchema
>;

export interface EngineeringLab {
  metadata: LabMetadata;
  evidence: LabEvidence;
  sourceDirectory: string;
}

async function readJson(
  filePath: string,
): Promise<unknown> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function readLab(
  directory: string,
): Promise<EngineeringLab | null> {
  const metadataPath = path.join(
    directory,
    "lab.json",
  );
  const evidencePath = path.join(
    directory,
    "evidence.json",
  );

  try {
    await Promise.all([
      fs.access(metadataPath),
      fs.access(evidencePath),
    ]);
  } catch {
    return null;
  }

  const [metadataRaw, evidenceRaw] =
    await Promise.all([
      readJson(metadataPath),
      readJson(evidencePath),
    ]);

  const metadataResult =
    labMetadataSchema.safeParse(metadataRaw);
  const evidenceResult =
    labEvidenceSchema.safeParse(evidenceRaw);

  const relativeDirectory = path.relative(
    LABS_ROOT,
    directory,
  );

  if (!metadataResult.success) {
    console.error(
      `Invalid lab metadata: ${relativeDirectory}`,
      metadataResult.error.flatten(),
    );

    throw new Error(
      `Invalid lab metadata in ${relativeDirectory}`,
    );
  }

  if (!evidenceResult.success) {
    console.error(
      `Invalid lab evidence: ${relativeDirectory}`,
      evidenceResult.error.flatten(),
    );

    throw new Error(
      `Invalid lab evidence in ${relativeDirectory}`,
    );
  }

  if (
    evidenceResult.data.labId !==
    metadataResult.data.id
  ) {
    throw new Error(
      `Lab/evidence ID mismatch in ${relativeDirectory}`,
    );
  }

  if (
    evidenceResult.data.externalApiUsed !==
      metadataResult.data.externalApiUsed ||
    evidenceResult.data.credentialsRequired !==
      metadataResult.data.credentialsRequired
  ) {
    throw new Error(
      `Lab/evidence capability mismatch in ${relativeDirectory}`,
    );
  }

  if (
    metadataResult.data.status === "verified" &&
    !evidenceResult.data.allPassed
  ) {
    throw new Error(
      `Verified lab has failing evidence: ${relativeDirectory}`,
    );
  }

  return {
    metadata: metadataResult.data,
    evidence: evidenceResult.data,
    sourceDirectory: relativeDirectory,
  };
}

export async function getAllLabs(): Promise<
  EngineeringLab[]
> {
  const entries = await fs.readdir(LABS_ROOT, {
    withFileTypes: true,
  });

  const labs = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        readLab(
          path.join(LABS_ROOT, entry.name),
        ),
      ),
  );

  return labs
    .filter(
      (lab): lab is EngineeringLab =>
        lab !== null,
    )
    .sort((left, right) => {
      if (
        left.metadata.featured !==
        right.metadata.featured
      ) {
        return left.metadata.featured ? -1 : 1;
      }

      return left.metadata.id.localeCompare(
        right.metadata.id,
      );
    });
}

export async function getLabBySlug(
  slug: string,
): Promise<EngineeringLab | null> {
  const labs = await getAllLabs();

  return (
    labs.find(
      (lab) => lab.metadata.slug === slug,
    ) ?? null
  );
}
