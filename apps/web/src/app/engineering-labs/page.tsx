import type { Metadata } from "next";
import Link from "next/link";

import { getAllLabs } from "@/lib/labs";

import styles from "./lab-experience.module.css";

export const metadata: Metadata = {
  title: "Engineering Labs",
  description:
    "Reproducible GenAI engineering experiments with executable tests, generated evidence, architecture decisions and explicit limitations.",
};

function yesNo(value: boolean): string {
  return value ? "Yes" : "None";
}

export default async function EngineeringLabsPage() {
  const labs = await getAllLabs();

  return (
    <section className={styles.page}>
      <div className="shell">
        <div className={styles.intro}>
          <div className="eyebrow">
            EXPERIMENTS & BENCHMARKS
          </div>

          <h1>Engineering Labs</h1>

          <p>
            Reproducible experiments that separate
            engineering evidence from portfolio claims.
            Test results shown here are read from generated
            verification artifacts committed with each lab.
          </p>
        </div>

        <div className={styles.labList}>
          {labs.map(({ metadata, evidence }) => (
            <article
              className={styles.labCard}
              key={metadata.id}
            >
              <div className={styles.cardTop}>
                <span className={styles.labId}>
                  {metadata.id}
                </span>

                <span className={styles.status}>
                  {evidence.allPassed
                    ? "Verified"
                    : "Failed"}
                </span>
              </div>

              <h2>{metadata.title}</h2>

              <p className={styles.description}>
                {metadata.description}
              </p>

              <div className={styles.topicList}>
                {metadata.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>

              <div className={styles.evidenceGrid}>
                <div>
                  <span>Tests</span>
                  <strong>
                    {evidence.passed}/
                    {evidence.testsRun}
                  </strong>
                </div>

                <div>
                  <span>Failures</span>
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

              <div className={styles.cardActions}>
                <Link
                  className={styles.primaryAction}
                  href={`/engineering-labs/${metadata.slug}`}
                >
                  Explore Lab
                </Link>

                <a
                  className={styles.secondaryAction}
                  href={metadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
