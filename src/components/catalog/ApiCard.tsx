import Link from "next/link";

import { Badge } from "@/components/ui/shadcn/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { formatRelativeDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { ApiCatalogEntry, AuthMethod, FreeStatus } from "@/types/api";

interface ApiCardProps {
  api: ApiCatalogEntry;
}

function authLabel(method: AuthMethod): string {
  if (method === "none") return "None";
  if (method === "api-key") return "API key";
  if (method === "oauth") return "OAuth";
  return "Basic";
}

function freeStatusLabel(status: FreeStatus): string {
  if (status === "quarantined") return "Not recommended";
  if (status === "free") return "Free";
  return status.replace("-", " ");
}

function trustStatusLabel(score: number): string {
  if (score >= 85) return "High trust";
  if (score >= 70) return "Medium trust";
  return "Low trust";
}

function buildSummary(api: ApiCatalogEntry): string {
  const parts = [
    api.category,
    api.license,
    `${api.endpoints.length} endpoint${api.endpoints.length === 1 ? "" : "s"}`,
    `Updated ${formatRelativeDate(api.lastUpdated)}`,
  ];

  return parts.join(" · ");
}

export function ApiCard({ api }: ApiCardProps) {
  const isFlagged = api.freeStatus === "quarantined" || api.freeStatus === "delisted";

  const stats = [
    { label: "Trust", value: `${api.trustScore}/100` },
    { label: "Docs", value: `${api.documentationCompleteness}%` },
    { label: "Auth", value: authLabel(api.authMethod) },
  ] as const;

  return (
    <Link href={`/apis/${api.slug}`} className="group block h-full">
      <Card
        className={cn(
          "h-full gap-0 overflow-hidden py-0 transition-colors hover:border-primary/40 hover:shadow-md",
          isFlagged && "border-amber-300 dark:border-amber-800",
        )}
      >
        <div className="h-28 border-b border-border/60 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent" />

        <CardHeader className="gap-3 px-5 pt-4 pb-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="font-display text-lg leading-snug group-hover:text-primary">
              {api.name}
            </CardTitle>
            <Badge
              variant={api.trustScore >= 85 ? "default" : "secondary"}
              className="shrink-0"
            >
              {trustStatusLabel(api.trustScore)}
            </Badge>
          </div>

          <Badge variant="outline" className="w-fit font-normal">
            {freeStatusLabel(api.freeStatus)}
          </Badge>
        </CardHeader>

        <CardContent className="px-5 pt-3 pb-0">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {api.description}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {buildSummary(api)}
          </p>

          {api.recommendationWarning ? (
            <p className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-300">
              Not recommended for production use
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="mt-4 flex items-start justify-between gap-4 border-t px-5 py-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-0.5 truncate text-sm font-medium">{stat.value}</p>
            </div>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
