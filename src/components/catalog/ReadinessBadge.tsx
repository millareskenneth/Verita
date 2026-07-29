import {
  getReadinessStatus,
  READINESS_LABELS,
  READINESS_STYLES,
  type CatalogReadinessStatus,
} from "@/lib/constants/catalog-readiness";
import { cn } from "@/lib/utils";
import type { ApiCatalogEntry } from "@/types/api";

interface ReadinessBadgeProps {
  api: ApiCatalogEntry;
  className?: string;
  showHint?: boolean;
}

export function ReadinessBadge({
  api,
  className,
  showHint = false,
}: ReadinessBadgeProps) {
  const status: CatalogReadinessStatus = getReadinessStatus(api);
  const { label, hint } = READINESS_LABELS[status];

  return (
    <div className={cn("space-y-1", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
          READINESS_STYLES[status],
        )}
      >
        {label}
      </span>
      {showHint ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
