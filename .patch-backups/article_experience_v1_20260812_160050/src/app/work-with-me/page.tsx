import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Me",
};

export default function WorkWithMePage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">WORK WITH ME</div>

        <h1>Turn a GenAI idea into an engineering solution.</h1>

        <p>
          Areas of collaboration will include GenAI architecture,
          enterprise RAG, agentic AI, GenAI evaluation, production
          readiness and POC-to-production engineering.
        </p>
      </div>
    </section>
  );
}
