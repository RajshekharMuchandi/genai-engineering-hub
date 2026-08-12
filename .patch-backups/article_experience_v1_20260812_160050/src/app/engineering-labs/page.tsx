import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Labs",
};

export default function EngineeringLabsPage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">EXPERIMENTS & BENCHMARKS</div>
        <h1>Engineering Labs</h1>

        <p>
          Reproducible experiments comparing GenAI architectures,
          models, retrieval strategies, prompts and evaluation methods.
        </p>
      </div>
    </section>
  );
}
