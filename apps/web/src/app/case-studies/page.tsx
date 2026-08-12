import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GenAI Case Studies",
};

export default function CaseStudiesPage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">PROBLEM → ARCHITECTURE → OUTCOME</div>
        <h1>Case Studies</h1>

        <p>
          Problem-driven analysis of GenAI architecture decisions,
          implementation approaches, constraints and lessons learned.
        </p>
      </div>
    </section>
  );
}
