import { Badge } from "@/components/ui/Badge";

interface SecurityScoreBadgeProps {
  score: number;
  compact?: boolean;
}

function getRiskLabel(score: number) {
  if (score >= 85) return { label: "High trust", variant: "success" as const };
  if (score >= 70) return { label: "Medium trust", variant: "warning" as const };
  return { label: "Low trust", variant: "danger" as const };
}

export function SecurityScoreBadge({ score, compact = false }: SecurityScoreBadgeProps) {
  const risk = getRiskLabel(score);

  if (compact) {
    return (
      <Badge variant={risk.variant}>
        {score}
      </Badge>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Trust score
      </p>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          {score}
        </span>
        <Badge variant={risk.variant}>{risk.label}</Badge>
      </div>
    </div>
  );
}
