"use client";

import { useMemo, useState } from "react";

import { CodeBlock, type CodeBlockLanguage } from "@/components/ui/CodeBlock";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { buildSnippet } from "@/lib/integration/build-code-snippets";
import type { ApiCatalogEntry } from "@/types/api";

interface CodeSnippetPanelProps {
  api: ApiCatalogEntry;
}

const SNIPPET_TABS = [
  { id: "curl", label: "cURL", language: "shell" as const },
  { id: "fetch", label: "JavaScript", language: "javascript" as const },
  { id: "python", label: "Python", language: "python" as const },
] as const;

type SnippetTab = (typeof SNIPPET_TABS)[number]["id"];

export function CodeSnippetPanel({ api }: CodeSnippetPanelProps) {
  const [activeTab, setActiveTab] = useState<SnippetTab>("curl");
  const snippet = useMemo(
    () => buildSnippet(activeTab === "fetch" ? "javascript" : activeTab, api),
    [activeTab, api],
  );

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
            <CodeBlock
              code={
                tab.id === activeTab
                  ? snippet
                  : buildSnippet(tab.id === "fetch" ? "javascript" : tab.id, api)
              }
              language={tab.language as CodeBlockLanguage}
              minHeight={tab.id === "curl" ? "6.5rem" : "8.5rem"}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
