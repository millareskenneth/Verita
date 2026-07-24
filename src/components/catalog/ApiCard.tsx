import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SecurityScoreBadge } from "@/components/api-detail/SecurityScoreBadge";
import { formatRelativeDate } from "@/lib/utils/format";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiCardProps {
  api: ApiCatalogEntry;
}

export function ApiCard({ api }: ApiCardProps) {
  return (
    <Link href={`/apis/${api.slug}`}>
      <Card className="h-full transition-colors hover:border-emerald-300 dark:hover:border-emerald-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {api.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {api.description}
            </p>
          </div>
          <SecurityScoreBadge score={api.trustScore} compact />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{api.category}</Badge>
          <Badge variant="muted">{api.license}</Badge>
          <Badge variant={api.freeStatus === "free" ? "success" : "warning"}>
            {api.freeStatus.replace("-", " ")}
          </Badge>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Updated {formatRelativeDate(api.lastUpdated)}
        </p>
      </Card>
    </Link>
  );
}
