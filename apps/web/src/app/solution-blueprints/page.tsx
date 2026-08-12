import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GenAI Solution Blueprints",
};

export default function SolutionBlueprintsPage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">BUSINESS SOLUTIONS</div>
        <h1>GenAI Solution Blueprints</h1>

        <p>
          Enterprise reference architectures for real business problems
          across banking, insurance, manufacturing, software, logistics
          and other industries.
        </p>
      </div>
    </section>
  );
}
