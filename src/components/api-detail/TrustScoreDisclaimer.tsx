import Link from "next/link";
import { TRUST_SCORE_DISCLAIMER } from "@/lib/constants/legal";

export function TrustScoreDisclaimer() {
  return (
    <div
      className="rounded-lg border border-border bg-muted/40 px-3 py-2.5"
      role="note"
      aria-label="Trust score disclaimer"
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Advisory: </span>
        {TRUST_SCORE_DISCLAIMER}{" "}
        <Link href="/terms#trust-scores" className="font-medium text-primary hover:underline">
          Learn more
        </Link>
      </p>
    </div>
  );
}
