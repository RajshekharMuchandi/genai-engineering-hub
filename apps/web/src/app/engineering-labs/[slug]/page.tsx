import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllLabs,
  getLabBySlug,
} from "@/lib/labs";

import styles from "../lab-experience.module.css";

interface LabPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const labs = await getAllLabs();

  return labs.map(({ metadata }) => ({
    slug: metadata.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LabPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);

  if (!lab) {
    return {};
  }

  return {
    title: `${lab.metadata.id} — ${lab.metadata.title}`,
    description: lab.metadata.description,
  };
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "None";
}

function formatVerifiedAt(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function LabPage({
  params,
}: LabPageProps) {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);

  if (!lab) {
    notFound();
  }

  const { metadata, evidence } = lab;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: `${metadata.id} — ${metadata.title}`,
    description: metadata.description,
    codeRepository: metadata.github,
    programmingLanguage: metadata.technologies,
    author: {
      "@type": "Person",
      name: "Rajshekhar Muchandi",
    },
  };

  return (
    <section className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="shell">
        <header className={styles.detailHeader}>
          <Link
            href="/engineering-labs"
            className={styles.back}
          >
            ← All engineering labs
          </Link>

          <div className={styles.badges}>
            <span>{metadata.id}</span>
            <span>Level · {metadata.level}</span>
            <span>Category · {metadata.category}</span>
            <span>
              Status ·{" "}
              {evidence.allPassed
                ? "verified"
                : "failed"}
            </span>
          </div>

          <h1>{metadata.title}</h1>

          <p className={styles.detailLead}>
            {metadata.description}
          </p>

          <div className={styles.evidenceGrid}>
            <div>
              <span>Tests passed</span>
              <strong>
                {evidence.passed}/
                {evidence.testsRun}
              </strong>
            </div>

            <div>
              <span>Failures / errors</span>
              <strong>
                {evidence.failures +
                  evidence.errors}
              </strong>
            </div>

            <div>
              <span>External API</span>
              <strong>
                {yesNo(
                  evidence.externalApiUsed,
                )}
              </strong>
            </div>

            <div>
              <span>Credentials</span>
              <strong>
                {yesNo(
                  evidence.credentialsRequired,
                )}
              </strong>
            </div>
          </div>

          <div className={styles.verifiedTime}>
            Verified · {formatVerifiedAt(evidence.verifiedAt)} UTC
            {" · "}Python {evidence.pythonVersion}
          </div>
        </header>

        <section className={styles.section}>
          <h2>Research question & hypothesis</h2>

          <div className={styles.questionCard}>
            <div>
              <span>RESEARCH QUESTION</span>
              <p>{metadata.researchQuestion}</p>
            </div>

            <div>
              <span>HYPOTHESIS</span>
              <p>{metadata.hypothesis}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Request lifecycle</h2>

          <pre
            className={`${styles.command} ${styles.lifecycleDiagram}`}
          >
{`User Input
    |
    v
Input Validation
    |
    v
Prompt / Context Assembly
    |
    v
ModelClient Interface
    |
    v
Model Generation
    |
    v
Structured Validation
    |
    +-------------------+
    |                   |
    v                   v
Response              Failure
    |
    v
Trace Evidence`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>Verified test areas</h2>

          <div className={styles.testMatrix}>
            {metadata.testAreas.map((area) => (
              <div key={area}>{area}</div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Reproduce the evidence</h2>

          <p>
            The public test count comes from
            <code> evidence.json </code>
            generated by the lab verification script.
          </p>

          {metadata.reproductionCommands.map(
            (command) => (
              <pre
                className={styles.command}
                key={command}
              >
                <code>{command}</code>
              </pre>
            ),
          )}

          <div className={styles.cardActions}>
            <a
              className={styles.secondaryAction}
              href={metadata.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source on GitHub
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.twoColumn}>
            <div className={styles.listCard}>
              <h3>Explicit limitations</h3>

              <ul>
                {metadata.limitations.map(
                  (limitation) => (
                    <li key={limitation}>
                      {limitation}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className={styles.listCard}>
              <h3>Next experiments</h3>

              <ul>
                {metadata.nextExperiments.map(
                  (experiment) => (
                    <li key={experiment}>
                      {experiment}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </section>

        {metadata.companionArticleSlug && (
          <section className={styles.companion}>
            <div>
              <div className="eyebrow">
                COMPANION ARTICLE
              </div>

              <h2>
                How LLM Applications Actually Work
              </h2>

              <p>
                Read the engineering explanation that
                connects this executable evidence to the
                broader production LLM request lifecycle.
              </p>
            </div>

            <Link
              className={styles.primaryAction}
              href={`/articles/${metadata.companionArticleSlug}`}
            >
              Read Article
            </Link>
          </section>
        )}
      </div>
    </section>
  );
}
