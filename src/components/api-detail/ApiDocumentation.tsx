import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EndpointList } from "@/components/api-detail/EndpointList";
import { formatAuthMethod, formatDate } from "@/lib/utils/format";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiDocumentationProps {
  api: ApiCatalogEntry;
}

export function ApiDocumentation({ api }: ApiDocumentationProps) {
  return (
    <div className="space-y-8">
      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{api.category}</Badge>
            <Badge variant="muted">{api.license}</Badge>
            <Badge variant={api.freeStatus === "free" ? "success" : "warning"}>
              {api.freeStatus.replace("-", " ")}
            </Badge>
          </div>

          <p className="text-zinc-700 dark:text-zinc-300">{api.description}</p>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Base URL</dt>
              <dd className="mt-1 break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {api.baseUrl}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Authentication</dt>
              <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                {formatAuthMethod(api.authMethod)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Source</dt>
              <dd className="mt-1 text-sm">
                <Link
                  href={api.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  View repository
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Last updated</dt>
              <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                {formatDate(api.lastUpdated)}
              </dd>
            </div>
            {api.rateLimit ? (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-zinc-500">Rate limits</dt>
                <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {api.rateLimit}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Card>

      <EndpointList endpoints={api.endpoints} />

      {(api.requestExample || api.responseExample) && (
        <section className="grid gap-4 lg:grid-cols-2">
          {api.requestExample ? (
            <Card>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Request example
              </h3>
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
                {api.requestExample}
              </pre>
            </Card>
          ) : null}
          {api.responseExample ? (
            <Card>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Response example
              </h3>
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
                {api.responseExample}
              </pre>
            </Card>
          ) : null}
        </section>
      )}
    </div>
  );
}
