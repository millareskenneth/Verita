"use client";

import { CodeBlock } from "@/components/ui/CodeBlock";

interface ResponseViewerProps {
  response: {
    status: number;
    latencyMs: number;
    body: string;
  };
  embedded?: boolean;
}

function formatResponseBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

function isJsonBody(body: string): boolean {
  try {
    JSON.parse(body);
    return true;
  } catch {
    return false;
  }
}

export function ResponseViewer({ response, embedded = false }: ResponseViewerProps) {
  const formattedBody = formatResponseBody(response.body);
  const jsonBody = isJsonBody(response.body);

  const content = (
    <div className="min-w-0">
      <p
        className={
          embedded
            ? "text-xs font-medium text-zinc-400"
            : "text-xs font-medium text-muted-foreground"
        }
      >
        Response
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className={embedded ? "text-zinc-400" : "text-muted-foreground"}>
          Status:{" "}
          <span className={embedded ? "font-medium text-zinc-100" : "font-medium text-foreground"}>
            {response.status}
          </span>
        </span>
        <span className={embedded ? "text-zinc-400" : "text-muted-foreground"}>
          Latency:{" "}
          <span className={embedded ? "font-medium text-zinc-100" : "font-medium text-foreground"}>
            {response.latencyMs} ms
          </span>
        </span>
      </div>
      <div className="mt-2">
        <CodeBlock
          code={formattedBody}
          language={jsonBody ? "json" : "text"}
          minHeight="10rem"
        />
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {content}
    </div>
  );
}
