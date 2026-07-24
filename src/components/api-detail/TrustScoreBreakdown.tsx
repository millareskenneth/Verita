import { Badge } from "@/components/ui/Badge";
import type { TrustScoreBreakdown } from "@/types/security";

interface TrustScoreBreakdownProps {
  breakdown: TrustScoreBreakdown;
}

const STATUS_VARIANT = {
  pass: "success",
  warning: "warning",
  fail: "danger",
  unknown: "muted",
} as const;

export function TrustScoreBreakdownPanel({ breakdown }: TrustScoreBreakdownProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Security breakdown
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Last scanned {new Date(breakdown.lastScannedAt).toLocaleString()}
        </p>
      </div>

      <ul className="space-y-3">
        {breakdown.checks.map((check) => (
          <li
            key={check.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {check.label}
              </p>
              {check.detail ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {check.detail}
                </p>
              ) : null}
            </div>
            <Badge variant={STATUS_VARIANT[check.status]}>{check.status}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
