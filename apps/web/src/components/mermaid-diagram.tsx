"use client";

import { useEffect, useId, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({
  chart,
}: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
        });

        const renderId = `mermaid-${reactId.replace(
          /[^a-zA-Z0-9_-]/g,
          "",
        )}`;

        const result = await mermaid.render(renderId, chart);

        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setSvg("");
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to render Mermaid diagram",
          );
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="mermaid-error">
        <strong>Diagram rendering failed.</strong>
        <pre>
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className="mermaid-loading"
        role="status"
        aria-live="polite"
      >
        Rendering architecture diagram…
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
