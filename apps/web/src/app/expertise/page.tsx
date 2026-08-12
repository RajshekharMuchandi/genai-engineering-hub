import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GenAI Engineering Expertise",
};

export default function ExpertisePage() {
  return (
    <section className="section">
      <div className="shell">
        <div className="eyebrow">TECHNICAL FOCUS</div>

        <h1>Enterprise GenAI Engineering</h1>

        <p>
          RAG · Agentic AI · MCP · Evaluation · LLMOps · Security ·
          Enterprise Architecture
        </p>
      </div>
    </section>
  );
}
