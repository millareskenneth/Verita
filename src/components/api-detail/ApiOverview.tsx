import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatAuthMethod, formatDate } from "@/lib/utils/format";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiOverviewProps {
  api: ApiCatalogEntry;
}

export function ApiOverview({ api }: ApiOverviewProps) {
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
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Base URL</dt>
            <dd className="mt-1 break-all font-mono text-sm text-foreground">
              {api.baseUrl}
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
