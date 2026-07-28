"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ResponseViewer } from "@/components/tester/ResponseViewer";
import { CodeSnippetPanel } from "@/components/tester/CodeSnippetPanel";
import { API_BASE_URL } from "@/lib/constants/config";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiTesterProps {
  api: ApiCatalogEntry;
}

interface TestResponse {
  status: number;
  latencyMs: number;
  body: string;
}

function buildDefaultPath(api: ApiCatalogEntry): string {
  return api.endpoints[0]?.path ?? "/";
}

function buildDefaultQuery(api: ApiCatalogEntry): string {
  const endpoint = api.endpoints[0];
  if (!endpoint?.parameters?.length) return "";

  return endpoint.parameters
    .filter((param) => param.in === "query" && param.example)
    .map((param) => `${param.name}=${param.example}`)
    .join("&");
}

function buildPathExample(api: ApiCatalogEntry): string {
  const endpoint = api.endpoints[0];
  const pathParam = endpoint?.parameters?.find((param) => param.in === "path");
  if (!endpoint || !pathParam?.example) return buildDefaultPath(api);

  return endpoint.path.replace(`{${pathParam.name}}`, pathParam.example);
}

function resolveRequestPath(api: ApiCatalogEntry, path: string): string {
  const endpoint = api.endpoints.find((item) => item.path === path.split("?")[0]);
  const pathParam = endpoint?.parameters?.find((param) => param.in === "path");

  if (!pathParam?.example || !path.includes("{")) {
    return path;
  }

  return path.replace(`{${pathParam.name}}`, pathParam.example);
}

async function sendDirectRequest(
  requestUrl: string,
  apiKey: string,
): Promise<TestResponse> {
  const headers: HeadersInit = {};
  if (apiKey.trim()) {
    headers["x-api-key"] = apiKey.trim();
  }

  const started = performance.now();
  const result = await fetch(requestUrl, { headers });
  const body = await result.text();

  return {
    status: result.status,
    latencyMs: Math.round(performance.now() - started),
    body,
  };
}

async function sendProxyRequest(
  api: ApiCatalogEntry,
  path: string,
  query: string,
  apiKey: string,
): Promise<TestResponse> {
  const params = new URLSearchParams({ path });
  if (query.trim()) params.set("query", query.trim());
  if (apiKey.trim()) params.set("apiKey", apiKey.trim());

  const response = await fetch(
    `${API_BASE_URL}/api/catalog/${api.slug}/test?${params.toString()}`,
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Proxy request failed: ${response.status}`);
  }

  const data = (await response.json()) as TestResponse;
  return {
    status: data.status,
    latencyMs: data.latencyMs,
    body: data.body,
  };
}

export function ApiTester({ api }: ApiTesterProps) {
  const [path, setPath] = useState(() => buildPathExample(api));
  const [query, setQuery] = useState(() => buildDefaultQuery(api));
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viaProxy, setViaProxy] = useState(false);

  const resolvedPath = useMemo(
    () => resolveRequestPath(api, path),
    [api, path],
  );

  const requestUrl = useMemo(() => {
    const normalizedPath = resolvedPath.startsWith("/")
      ? resolvedPath
      : `/${resolvedPath}`;
    const base = `${api.baseUrl}${normalizedPath.split("?")[0]}`;
    return query.trim() ? `${base}?${query.trim()}` : base;
  }, [api.baseUrl, query, resolvedPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setViaProxy(false);

    try {
      try {
        const direct = await sendDirectRequest(requestUrl, apiKey);
        setResponse(direct);
      } catch {
        const proxied = await sendProxyRequest(api, resolvedPath, query, apiKey);
        setResponse(proxied);
        setViaProxy(true);
      }
    } catch (proxyError) {
      setError(
        proxyError instanceof Error
          ? proxyError.message
          : "Both direct and proxy requests failed. Check the backend is running.",
      );
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-3">
      <Card className="min-w-0 overflow-hidden">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Try it now</h2>
          <p className="text-xs text-muted-foreground">Direct or proxy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
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
              placeholder="key=value"
            />
          </div>
          {api.authMethod === "api-key" ? (
            <Input
              label="API key"
              name="apiKey"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          ) : null}

          <div className="min-w-0 overflow-hidden rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs">
            <code className="block break-all whitespace-pre-wrap text-foreground">
              <span className="font-semibold text-primary">GET</span> {requestUrl}
            </code>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send request"}
          </Button>
        </form>

        {viaProxy ? (
          <p className="mt-3 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
            Routed through Verita proxy (CORS blocked direct call).
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {error}
          </p>
        ) : null}
      </Card>

      {response ? <ResponseViewer response={response} /> : null}
      <CodeSnippetPanel url={requestUrl} />
    </div>
  );
}
