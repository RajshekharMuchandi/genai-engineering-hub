import Link from "next/link";

const expertise = [
  {
    title: "Enterprise RAG",
    description:
      "Retrieval architecture, ingestion, hybrid search, reranking, authorization, evaluation and production observability.",
  },
  {
    title: "Agentic AI",
    description:
      "Tool-using agents, orchestration, state, memory, human approval, multi-agent systems and reliable execution.",
  },
  {
    title: "LLM Evaluation",
    description:
      "Repeatable evaluation of retrieval, groundedness, correctness, agents, tool calls, regressions, latency and cost.",
  },
  {
    title: "GenAI Security",
    description:
      "Prompt injection, data isolation, authorization, tool permissions, secrets, auditability and enterprise controls.",
  },
  {
    title: "LLMOps",
    description:
      "Tracing, prompt and model lifecycle, monitoring, cost controls, quality gates and production feedback loops.",
  },
  {
    title: "Enterprise Architecture",
    description:
      "Integrating GenAI into APIs, microservices, Java ecosystems, distributed systems, cloud and enterprise workflows.",
  },
];

const flagshipProjects = [
  {
    number: "01",
    title: "Enterprise RAG Platform",
    description:
      "Production-oriented reference architecture covering ingestion, retrieval, reranking, authorization, citations, evaluation and observability.",
    status: "Planned",
  },
  {
    number: "02",
    title: "GenAI Evaluation Platform",
    description:
      "Framework-neutral experimentation and quality platform for RAG, prompts, models and agent systems.",
    status: "Planned",
  },
  {
    number: "03",
    title: "Enterprise Agent Platform",
    description:
      "Secure agent execution with tools, state, human approval, resilience, permissions, tracing and evaluation.",
    status: "Planned",
  },
];

const focusAreas = [
  "RAG",
  "AI Agents",
  "MCP",
  "A2A",
  "Evaluation",
  "LLMOps",
  "Security",
  "Architecture",
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-main">
            <div className="eyebrow">
              ENTERPRISE GENAI · ARCHITECTURE · ENGINEERING
            </div>

            <h1>
              Building GenAI systems that move beyond demos and into
              <span> production.</span>
            </h1>

            <p className="hero-lead">
              I explore how Generative AI systems are designed, built,
              evaluated, secured and operated in real enterprise environments —
              with a focus on RAG, AI agents, LLMOps and distributed
              architecture.
            </p>

            <div className="hero-actions">
              <Link href="/projects" className="button button-primary">
                Explore Projects
              </Link>

              <Link href="/articles" className="button button-secondary">
                Read Engineering Articles
              </Link>
            </div>

            <div className="focus-list">
              {focusAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>

          <aside className="engineering-card">
            <div className="terminal-top">
              <span />
              <span />
              <span />
            </div>

            <div className="terminal-body">
              <div className="terminal-comment">
                {"// Engineering philosophy"}
              </div>

              <div>
                <span className="terminal-key">01.</span> Understand the
                business problem
              </div>

              <div>
                <span className="terminal-key">02.</span> Design the
                architecture
              </div>

              <div>
                <span className="terminal-key">03.</span> Build the system
              </div>

              <div>
                <span className="terminal-key">04.</span> Test failure scenarios
              </div>

              <div>
                <span className="terminal-key">05.</span> Measure AI quality
              </div>

              <div>
                <span className="terminal-key">06.</span> Secure and observe it
              </div>

              <div>
                <span className="terminal-key">07.</span> Explain the trade-offs
              </div>

              <div className="terminal-result">
                Build → Measure → Explain
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-light">
        <div className="shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow">AREAS OF EXPERTISE</div>

              <h2>Engineering the complete GenAI system</h2>
            </div>

            <p>
              The hard part of enterprise GenAI is not calling a model API.
              It is building the system around the model so that it remains
              useful, measurable, secure and operable.
            </p>
          </div>

          <div className="expertise-grid">
            {expertise.map((item, index) => (
              <article className="expertise-card" key={item.title}>
                <div className="card-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow">FLAGSHIP BUILDS</div>
              <h2>Projects that demonstrate engineering depth</h2>
            </div>

            <Link href="/projects" className="text-link">
              View all projects →
            </Link>
          </div>

          <div className="project-list">
            {flagshipProjects.map((project) => (
              <article className="project-row" key={project.number}>
                <div className="project-number">{project.number}</div>

                <div className="project-content">
                  <div className="project-title-row">
                    <h3>{project.title}</h3>
                    <span>{project.status}</span>
                  </div>

                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell proof-grid">
          <div>
            <div className="eyebrow eyebrow-dark">
              ENGINEERING EVIDENCE
            </div>

            <h2>
              Expertise should be demonstrated,
              <br />
              not declared.
            </h2>
          </div>

          <div className="proof-items">
            <div>
              <strong>Architecture</strong>
              <span>Why the system is designed this way.</span>
            </div>

            <div>
              <strong>Implementation</strong>
              <span>Working code instead of diagrams alone.</span>
            </div>

            <div>
              <strong>Evaluation</strong>
              <span>Measured quality instead of subjective confidence.</span>
            </div>

            <div>
              <strong>Failure Analysis</strong>
              <span>What breaks and how the system recovers.</span>
            </div>

            <div>
              <strong>Trade-offs</strong>
              <span>Alternatives, constraints, cost and complexity.</span>
            </div>

            <div>
              <strong>Production Thinking</strong>
              <span>Security, observability and operational design.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell audience-grid">
          <article className="audience-card">
            <div className="eyebrow">FOR ENGINEERING LEADERS</div>

            <h2>Looking for someone to build production GenAI?</h2>

            <p>
              Explore detailed architectures, reference implementations,
              engineering experiments and production design decisions.
            </p>

            <Link href="/projects" className="text-link">
              Explore engineering work →
            </Link>
          </article>

          <article className="audience-card audience-card-accent">
            <div className="eyebrow">FOR CLIENTS</div>

            <h2>Have a business problem that GenAI might solve?</h2>

            <p>
              Start with the problem. We can determine whether the correct
              solution is RAG, automation, an agent, a workflow — or no LLM at
              all.
            </p>

            <Link href="/work-with-me" className="text-link">
              Discuss a problem →
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
