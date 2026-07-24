"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";

interface CodeSnippetPanelProps {
  url: string;
}

const SNIPPET_TABS = [
  { id: "curl", label: "cURL" },
  { id: "fetch", label: "JavaScript" },
  { id: "python", label: "Python" },
] as const;

type SnippetTab = (typeof SNIPPET_TABS)[number]["id"];

function buildSnippet(tab: SnippetTab, url: string) {
  switch (tab) {
    case "fetch":
      return `const response = await fetch("${url}");\nconst data = await response.json();\nconsole.log(data);`;
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
    <Card>
      <div className="mb-4 flex flex-wrap gap-2">
        {SNIPPET_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
        {snippet}
      </pre>
    </Card>
  );
}
