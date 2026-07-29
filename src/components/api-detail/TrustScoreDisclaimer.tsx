import Link from "next/link";
import { TRUST_SCORE_DISCLAIMER } from "@/lib/constants/legal";

export function TrustScoreDisclaimer() {
  return (
    <div
      className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
      role="note"
      aria-label="Trust score disclaimer"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Advisory notice
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground/85">
        {TRUST_SCORE_DISCLAIMER}{" "}
        <Link href="/terms#trust-scores" className="font-medium text-primary hover:underline">
          Learn more
        </Link>
      </p>
    </div>
  );
}
