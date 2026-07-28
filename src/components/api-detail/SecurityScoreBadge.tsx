import { Badge } from "@/components/ui/Badge";

interface SecurityScoreBadgeProps {
  score: number;
  compact?: boolean;
  inline?: boolean;
}

function getRiskLabel(score: number) {
  if (score >= 85) return { label: "High trust", variant: "success" as const };
  if (score >= 70) return { label: "Medium trust", variant: "warning" as const };
  return { label: "Low trust", variant: "danger" as const };
}

export function SecurityScoreBadge({
  score,
  compact = false,
  inline = false,
}: SecurityScoreBadgeProps) {
  const risk = getRiskLabel(score);

  if (compact) {
    return (
      <Badge variant={risk.variant}>
        {score}
      </Badge>
    );
  }

  if (inline) {
    return (
      <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Trust score
          </p>
          <p className="text-2xl font-bold leading-none text-foreground">{score}</p>
        </div>
        <Badge variant={risk.variant}>{risk.label}</Badge>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium text-muted-foreground">Trust score</p>
      <div className="mt-1.5 flex items-end gap-3">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <Badge variant={risk.variant}>{risk.label}</Badge>
      </div>
    </div>
  );
}
