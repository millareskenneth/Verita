"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";

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
    <Card className="min-w-0 border-border bg-card">
      <h2 className="text-lg font-semibold text-foreground">Code examples</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Copy a snippet for your preferred language or tool.
      </p>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SnippetTab)}
        className="mt-4"
      >
        <TabsList>
          {SNIPPET_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SNIPPET_TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-3">
            <pre className="max-h-96 min-w-0 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100">
              {tab.id === activeTab ? snippet : buildSnippet(tab.id, url)}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
