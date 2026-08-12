import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GenAI Projects",
  description:
    "Production-oriented GenAI reference implementations and engineering projects.",
};

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">REFERENCE IMPLEMENTATIONS</div>
        <h1>GenAI Projects</h1>

        <p>
          Projects will connect architecture, implementation, testing,
          evaluation, security and production operations.
        </p>
      </div>
    </section>
  );
}
