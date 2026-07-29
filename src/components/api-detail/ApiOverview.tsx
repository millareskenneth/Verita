import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatAuthMethod, formatDate } from "@/lib/utils/format";
import { getBaseUrlHref } from "@/lib/utils/api-request-url";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiOverviewProps {
  api: ApiCatalogEntry;
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-border/60 py-2.5 last:border-b-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ApiOverview({ api }: ApiOverviewProps) {
  const baseUrlHref = getBaseUrlHref(api);
  const opensLiveEndpoint = api.endpoints.length > 0;

  return (
    <Card className="w-full max-w-2xl border-border bg-card p-4 sm:p-4">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{api.category}</Badge>
          <Badge variant={api.freeStatus === "free" ? "success" : "warning"}>
            {api.freeStatus.replace("-", " ")}
          </Badge>
        </div>

        <dl>
          <MetaRow label="Base URL">
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
          </MetaRow>

          <MetaRow label="Authentication">
            {formatAuthMethod(api.authMethod)}
          </MetaRow>

          <MetaRow label="Last updated">{formatDate(api.lastUpdated)}</MetaRow>

          {api.sourceUrl && api.sourceUrl !== baseUrlHref ? (
            <MetaRow label="Official source">
              <a
                href={api.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm text-primary underline-offset-4 hover:underline"
              >
                {api.sourceUrl}
              </a>
            </MetaRow>
          ) : null}

          {api.rateLimit ? (
            <MetaRow label="Rate limits">{api.rateLimit}</MetaRow>
          ) : null}
        </dl>
      </div>
    </Card>
  );
}
