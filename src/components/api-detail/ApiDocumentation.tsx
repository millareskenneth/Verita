import Link from "next/link";
import { EndpointList } from "@/components/api-detail/EndpointList";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  getLicenseUrl,
  requiresLicenseVerification,
} from "@/lib/constants/licenses";
import { formatAuthMethod, formatDate } from "@/lib/utils/format";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiDocumentationProps {
  api: ApiCatalogEntry;
}

function sourceLabel(sourceUrl: string): string {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
    if (hostname.includes("github.com")) return "GitHub";
    if (hostname.includes("gitlab.com")) return "GitLab";
    return "Source";
  } catch {
    return "Source";
  }
}

export function ApiDocumentation({ api }: ApiDocumentationProps) {
  const licenseUrl = getLicenseUrl(api.license);
  const verifyLicense = requiresLicenseVerification(api.license);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{api.category}</Badge>
          <Badge variant={api.freeStatus === "free" ? "success" : "warning"}>
            {api.freeStatus.replace("-", " ")}
          </Badge>
          <Badge variant="muted">{api.license}</Badge>
        </div>

        <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <dt className="text-xs font-medium text-muted-foreground">Base URL</dt>
            <dd className="mt-0.5 break-all font-mono text-foreground">{api.baseUrl}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Auth</dt>
            <dd className="mt-0.5 text-foreground">{formatAuthMethod(api.authMethod)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Updated</dt>
            <dd className="mt-0.5 text-foreground">{formatDate(api.lastUpdated)}</dd>
          </div>
          {api.rateLimit ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground">Rate limits</dt>
              <dd className="mt-0.5 text-foreground">{api.rateLimit}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">License</p>
            {licenseUrl ? (
              <Link
                href={licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-sm font-semibold text-primary hover:underline"
              >
                {api.license}
              </Link>
            ) : (
              <p className="mt-0.5 text-sm font-semibold text-foreground">{api.license}</p>
            )}
            {verifyLicense ? (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                Verify upstream license before use.
              </p>
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Official source</p>
            <Link
              href={api.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {sourceLabel(api.sourceUrl)}
            </Link>
            <p className="mt-1 break-all text-xs text-muted-foreground">{api.sourceUrl}</p>
          </div>
        </div>
      </Card>

      <EndpointList endpoints={api.endpoints} />

      {api.requestExample || api.responseExample ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {api.requestExample ? (
            <Card>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Request example
              </h3>
              <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 text-xs text-foreground">
                {api.requestExample}
              </pre>
            </Card>
          ) : null}
          {api.responseExample ? (
            <Card>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Response example
              </h3>
              <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 text-xs text-foreground">
                {api.responseExample}
              </pre>
            </Card>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
