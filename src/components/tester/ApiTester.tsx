"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ResponseViewer } from "@/components/tester/ResponseViewer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { API_BASE_URL } from "@/lib/constants/config";
import {
  buildDefaultQuery,
  buildPathExample,
} from "@/lib/utils/api-request-url";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiTesterProps {
  api: ApiCatalogEntry;
}

interface TestResponse {
  status: number;
  latencyMs: number;
  body: string;
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
  const prefersReducedMotion = usePrefersReducedMotion();
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
    <Card className="min-w-0 overflow-hidden border-border bg-card">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Try it now</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sends a GET request directly when CORS allows it, otherwise routes
          through the Verita backend proxy.
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send request"}
        </Button>
      </form>

      <div className="mt-4 min-w-0 overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-zinc-950/90 p-3">
          <p className="text-xs font-medium text-zinc-400">Request</p>
          <pre className="mt-1 max-h-28 min-w-0 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-emerald-400">
            GET {requestUrl}
          </pre>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {response ? (
            <motion.div
              key={`${response.status}-${response.latencyMs}-${response.body.slice(0, 24)}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 bg-zinc-950/70 p-3"
            >
              <ResponseViewer response={response} embedded />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {viaProxy ? (
          <motion.p
            key="proxy-notice"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200"
          >
            Request routed through the Verita backend proxy (direct browser call
            was blocked by CORS).
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key={error}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
