import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleMarkdownProps {
  content: string;
}

export function ArticleMarkdown({
  content,
}: ArticleMarkdownProps) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external =
              href?.startsWith("http://") ||
              href?.startsWith("https://");

            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
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
