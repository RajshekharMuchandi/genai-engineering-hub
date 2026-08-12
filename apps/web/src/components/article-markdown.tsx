import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { MermaidDiagram } from "@/components/mermaid-diagram";
import {
  reactNodeToText,
  slugifyHeading,
} from "@/lib/article-utils";

interface ArticleMarkdownProps {
  content: string;
}

interface CodeElementProps {
  className?: string;
  children?: ReactNode;
}

function HeadingAnchor({
  level,
  children,
}: {
  level: 2 | 3;
  children: ReactNode;
}) {
  const text = reactNodeToText(children);
  const id = slugifyHeading(text);

  const contents = (
    <a
      href={`#${id}`}
      className="heading-anchor"
      aria-label={`Link to ${text}`}
    >
      {children}
      <span aria-hidden="true">#</span>
    </a>
  );

  return level === 2 ? (
    <h2 id={id}>{contents}</h2>
  ) : (
    <h3 id={id}>{contents}</h3>
  );
}

export function ArticleMarkdown({
  content,
}: ArticleMarkdownProps) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children }) => (
            <HeadingAnchor level={2}>
              {children}
            </HeadingAnchor>
          ),
          h3: ({ children }) => (
            <HeadingAnchor level={3}>
              {children}
            </HeadingAnchor>
          ),
          pre: ({ children }) => {
            const child = Children.count(children) === 1
              ? Children.only(children)
              : null;

            if (
              child &&
              isValidElement(child)
            ) {
              const element =
                child as ReactElement<CodeElementProps>;

              if (
                element.props.className?.includes(
                  "language-mermaid",
                )
              ) {
                const chart = reactNodeToText(
                  element.props.children,
                ).replace(/\n$/, "");

                return <MermaidDiagram chart={chart} />;
              }
            }

            return <pre>{children}</pre>;
          },
          a: ({ href, children }) => {
            const external =
              href?.startsWith("http://") ||
              href?.startsWith("https://");

            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={
                  external
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
