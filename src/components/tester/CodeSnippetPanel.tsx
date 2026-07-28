"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";

interface CodeSnippetPanelProps {
  url: string;
}

const SNIPPET_TABS = [
  { id: "curl", label: "cURL" },
  { id: "fetch", label: "JS" },
  { id: "python", label: "Python" },
] as const;

type SnippetTab = (typeof SNIPPET_TABS)[number]["id"];

function buildSnippet(tab: SnippetTab, url: string) {
  switch (tab) {
    case "fetch":
      return `const response = await fetch("${url}");\nconst data = await response.json();`;
    case "python":
      return `import requests\n\nresponse = requests.get("${url}")\nprint(response.json())`;
    default:
      return `curl "${url}"`;
  }
}

export function CodeSnippetPanel({ url }: CodeSnippetPanelProps) {
  const [activeTab, setActiveTab] = useState<SnippetTab>("curl");
  const snippet = useMemo(() => buildSnippet(activeTab, url), [activeTab, url]);

  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-xs transition-transform group-open:rotate-90">▶</span>
          Code snippets
        </span>
      </summary>
      <Card className="mt-2 min-w-0 overflow-hidden">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SNIPPET_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 text-xs text-foreground">
          {snippet}
        </pre>
      </Card>
    </details>
  );
}
