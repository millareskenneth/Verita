import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ReadinessBadge } from "@/components/catalog/ReadinessBadge";
import {
  getReadinessStatus,
  READINESS_LABELS,
} from "@/lib/constants/catalog-readiness";
import { formatRelativeDate } from "@/lib/utils/format";
import { getTrustLabel, TRUST_VARIANT_STYLES } from "@/lib/constants/trust-score";
import { cn } from "@/lib/utils";
import type { ApiCatalogEntry, AuthMethod } from "@/types/api";

interface ApiCardProps {
  api: ApiCatalogEntry;
}

function authTagLabel(method: AuthMethod): string {
  if (method === "none") return "no auth";
  if (method === "api-key") return "api key";
  if (method === "oauth") return "oauth";
  return "basic auth";
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

export function ApiCard({ api }: ApiCardProps) {
  const isFlagged = api.freeStatus === "quarantined" || api.freeStatus === "delisted";
  const trust = getTrustLabel(api.trustScore);
  const trustStyles = TRUST_VARIANT_STYLES[trust.variant];
  const endpointCount = api.endpoints.length;
  const readiness = getReadinessStatus(api);
  const readinessHint = READINESS_LABELS[readiness].hint;

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-border-accent hover:shadow-md",
        isFlagged && "border-amber-400/40 dark:border-amber-700/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-lg font-semibold leading-snug text-foreground">
          {api.name}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            trustStyles.badge,
          )}
        >
          {trust.label}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {api.description}
      </p>

      <div className="mt-3">
        <ReadinessBadge api={api} />
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{readinessHint}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <TagPill>{api.category}</TagPill>
        <TagPill>{api.license}</TagPill>
        <TagPill>{authTagLabel(api.authMethod)}</TagPill>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">Trust score</span>
          <span className="font-medium text-foreground">{api.trustScore}/100</span>
        </div>
        <div
          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={api.trustScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Trust score ${api.trustScore} out of 100`}
        >
          <div
            className={cn("h-full rounded-full", trustStyles.bar)}
            style={{ width: `${api.trustScore}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {endpointCount} endpoint{endpointCount === 1 ? "" : "s"} · updated{" "}
        {formatRelativeDate(api.lastUpdated)}
      </p>

      {api.recommendationWarning ? (
        <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
          Not recommended for production use
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <Link
          href={`/apis/${api.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          View API
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
