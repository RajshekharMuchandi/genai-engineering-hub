import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.name,
    },
  ],
  creator: siteConfig.name,
  category: "technology",
  keywords: [
    "Generative AI",
    "GenAI",
    "Enterprise AI",
    "RAG",
    "Retrieval Augmented Generation",
    "Agentic AI",
    "AI Agents",
    "LLMOps",
    "LLM Evaluation",
    "MCP",
    "AI Architecture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />

        <main>{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
