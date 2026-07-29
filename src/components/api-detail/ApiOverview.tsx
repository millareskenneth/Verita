import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatAuthMethod, formatDate } from "@/lib/utils/format";
import { getBaseUrlHref } from "@/lib/utils/api-request-url";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiOverviewProps {
  api: ApiCatalogEntry;
}

export function ApiOverview({ api }: ApiOverviewProps) {
  const baseUrlHref = getBaseUrlHref(api);
  const opensLiveEndpoint = api.endpoints.length > 0;

  return (
    <Card className="border-border bg-card">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{api.category}</Badge>
          <Badge variant={api.freeStatus === "free" ? "success" : "warning"}>
            {api.freeStatus.replace("-", " ")}
          </Badge>
        </div>

        <p className="text-foreground/90">{api.description}</p>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Base URL</dt>
            <dd className="mt-1">
              <a
                href={baseUrlHref}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-sm text-primary underline-offset-4 hover:underline"
              >
                {api.baseUrl}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                {opensLiveEndpoint
                  ? "Opens a live API endpoint in a new tab."
                  : "Opens official documentation in a new tab."}
              </p>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Authentication</dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatAuthMethod(api.authMethod)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Last updated</dt>
            <dd className="mt-1 text-sm text-foreground">{formatDate(api.lastUpdated)}</dd>
          </div>
          {api.sourceUrl && api.sourceUrl !== baseUrlHref ? (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Official source</dt>
              <dd className="mt-1">
                <a
                  href={api.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-primary underline-offset-4 hover:underline"
                >
                  {api.sourceUrl}
                </a>
              </dd>
            </div>
          ) : null}
          {api.rateLimit ? (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Rate limits</dt>
              <dd className="mt-1 text-sm text-foreground">{api.rateLimit}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Card>
  );
}
