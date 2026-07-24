"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ResponseViewer } from "@/components/tester/ResponseViewer";
import { CodeSnippetPanel } from "@/components/tester/CodeSnippetPanel";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiTesterProps {
  api: ApiCatalogEntry;
}

interface TestResponse {
  status: number;
  latencyMs: number;
  body: string;
}

export function ApiTester({ api }: ApiTesterProps) {
  const defaultEndpoint = api.endpoints[0];
  const [path, setPath] = useState(defaultEndpoint?.path ?? "/");
  const [query, setQuery] = useState("latitude=52.52&longitude=13.41");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestUrl = useMemo(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const base = `${api.baseUrl}${normalizedPath}`;
    return query.trim() ? `${base}?${query.trim()}` : base;
  }, [api.baseUrl, path, query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const started = performance.now();

    try {
      const headers: HeadersInit = {};
      if (api.authMethod === "api-key" && apiKey.trim()) {
        headers["x-api-key"] = apiKey.trim();
      }

      const result = await fetch(requestUrl, { headers });
      const body = await result.text();

      setResponse({
        status: result.status,
        latencyMs: Math.round(performance.now() - started),
        body,
      });
    } catch {
      setError(
        "Direct browser requests may fail due to CORS. Phase 2 will route sandboxed tests through the backend proxy.",
      );
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Try it now
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            MVP supports GET requests from the browser. Copied snippets always
            point to the original API.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Endpoint path"
            name="path"
            value={path}
            onChange={(event) => setPath(event.target.value)}
          />
          <Input
            label="Query string"
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="key=value&key2=value2"
          />
          {api.authMethod === "api-key" ? (
            <Input
              label="API key"
              name="apiKey"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          ) : null}

          <div className="rounded-lg bg-zinc-950 px-4 py-3 font-mono text-sm text-emerald-300">
            GET {requestUrl}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send request"}
          </Button>
        </form>

        {error ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {error}
          </p>
        ) : null}
      </Card>

      {response ? <ResponseViewer response={response} /> : null}
      <CodeSnippetPanel url={requestUrl} />
    </div>
  );
}
