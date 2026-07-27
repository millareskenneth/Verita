import Link from "next/link";
import { TRUST_SCORE_DISCLAIMER } from "@/lib/constants/legal";

export function TrustScoreDisclaimer() {
  return (
    <div
      className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 sm:px-5 dark:border-zinc-800 dark:bg-zinc-900/60"
      role="note"
      aria-label="Trust score disclaimer"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        Advisory notice
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {TRUST_SCORE_DISCLAIMER}{" "}
        <Link
          href="/terms#trust-scores"
          className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Learn more
        </Link>
      </p>
    </div>
  );
}
