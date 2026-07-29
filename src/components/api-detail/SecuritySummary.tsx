"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import type { TrustScoreBreakdown } from "@/types/security";

interface SecuritySummaryProps {
  breakdown: TrustScoreBreakdown;
  onViewBreakdown: () => void;
}

export function SecuritySummary({ breakdown, onViewBreakdown }: SecuritySummaryProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const passed = breakdown.checks.filter((check) => check.status === "pass").length;
  const total = breakdown.checks.length;

  const className =
    "rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted/30";

  const content = (
    <>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Security checks
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">
        {passed} of {total} checks passed
      </p>
      <p className="mt-1 text-xs font-medium text-primary">View full breakdown →</p>
    </>
  );

  if (prefersReducedMotion) {
    return (
      <button type="button" onClick={onViewBreakdown} className={className}>
        {content}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onViewBreakdown}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(className, "block w-full sm:w-auto")}
    >
      {content}
    </motion.button>
  );
}
