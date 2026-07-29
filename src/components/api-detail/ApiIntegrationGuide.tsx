"use client";

import { useMemo, useState } from "react";

import { CodeBlock, type CodeBlockLanguage } from "@/components/ui/CodeBlock";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { buildIntegrationGuide } from "@/lib/integration/build-integration-guide";
import { buildSnippet } from "@/lib/integration/build-code-snippets";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiIntegrationGuideProps {
  api: ApiCatalogEntry;
}

const SNIPPET_TABS = [
  { id: "curl", label: "cURL", language: "shell" as const },
  { id: "javascript", label: "JavaScript", language: "javascript" as const },
  { id: "python", label: "Python", language: "python" as const },
] as const;

type SnippetTab = (typeof SNIPPET_TABS)[number]["id"];

function GuideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function StepList({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{step.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {step.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function EndpointSnippets({
  snippets,
}: {
  snippets: { curl: string; javascript: string; python: string };
}) {
  const [activeTab, setActiveTab] = useState<SnippetTab>("curl");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as SnippetTab)}
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
            code={snippets[tab.id === "curl" ? "curl" : tab.id]}
            language={tab.language as CodeBlockLanguage}
            minHeight={tab.id === "curl" ? "7rem" : "9rem"}
            copyable
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function ApiIntegrationGuide({ api }: ApiIntegrationGuideProps) {
  const guide = useMemo(() => buildIntegrationGuide(api), [api]);
  const fallbackSnippets = useMemo(
    () => ({
      curl: buildSnippet("curl", api),
      javascript: buildSnippet("javascript", api),
      python: buildSnippet("python", api),
    }),
    [api],
  );

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground">
          Integration guide
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {guide.summary}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Official documentation:{" "}
          <a
            href={guide.officialDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-primary underline-offset-4 hover:underline"
          >
            {guide.officialDocsUrl}
          </a>
        </p>
      </Card>

      <Card className="border-border bg-card">
        <GuideSection title="Prerequisites">
          <StepList steps={guide.prerequisites} />
        </GuideSection>
      </Card>

      <Card className="border-border bg-card">
        <GuideSection title="Authentication">
          <StepList steps={guide.authSetup} />
          {guide.authCaveat ? (
            <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              {guide.authCaveat}
            </p>
          ) : null}
        </GuideSection>
      </Card>

      <Card className="border-border bg-card">
        <GuideSection title="Quick start">
          <StepList steps={guide.quickStart} />
        </GuideSection>
      </Card>

      {guide.hasStructuredEndpoints ? (
        <Card className="border-border bg-card">
          <GuideSection title="Endpoints & code examples">
            <p className="text-sm text-muted-foreground">
              Examples use parameter values from Verita&apos;s catalog. Replace
              placeholders with your own data where noted.
            </p>
            <div className="mt-4 space-y-6">
              {guide.endpoints.map((doc) => (
                <div
                  key={`${doc.endpoint.method}-${doc.endpoint.path}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                      {doc.endpoint.method}
                    </span>
                    <code className="text-sm text-foreground">
                      {doc.endpoint.path}
                    </code>
                  </div>
                  {doc.endpoint.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {doc.endpoint.description}
                    </p>
                  ) : null}
                  <p className="mt-2 break-all font-mono text-xs text-primary">
                    {doc.requestLine}
                  </p>
                  {doc.parameterNotes.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {doc.parameterNotes.map((note) => (
                        <li key={note}>• {note}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4">
                    <EndpointSnippets snippets={doc.snippets} />
                  </div>
                </div>
              ))}
            </div>
          </GuideSection>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <GuideSection title="Base URL example">
            <p className="text-sm text-muted-foreground">
              Verita does not have structured endpoints for this API yet. Use
              the provider&apos;s documentation to find paths and parameters.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p className="min-w-0 flex-1 break-all rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm text-foreground">
                {api.baseUrl}
              </p>
              <CopyButton text={api.baseUrl} label="Copy URL" copiedLabel="Copied" />
            </div>
            <div className="mt-4">
              <EndpointSnippets snippets={fallbackSnippets} />
            </div>
          </GuideSection>
        </Card>
      )}

      {guide.requestExample || guide.responseExample ? (
        <Card className="border-border bg-card">
          <GuideSection title="Request & response reference">
            {guide.requestExample ? (
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Sample request
                </p>
                <CodeBlock code={guide.requestExample} language="shell" minHeight="4rem" />
              </div>
            ) : null}
            {guide.responseExample ? (
              <div className={guide.requestExample ? "mt-4" : ""}>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Sample response
                </p>
                <CodeBlock
                  code={guide.responseExample}
                  language="json"
                  minHeight="8rem"
                />
              </div>
            ) : null}
          </GuideSection>
        </Card>
      ) : null}

      {guide.rateLimit ? (
        <Card className="border-border bg-card">
          <GuideSection title="Rate limits">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {guide.rateLimit}
            </p>
          </GuideSection>
        </Card>
      ) : null}

      <Card className="border-border bg-card">
        <GuideSection title="Error handling">
          <ul className="space-y-3">
            {guide.errorHandling.map((item) => (
              <li key={item.title}>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </GuideSection>
      </Card>

      <Card className="border-border bg-card">
        <GuideSection title="Important notes">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {guide.limitations.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </GuideSection>
      </Card>
    </div>
  );
}
