"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { CollapseMotion } from "@/components/motion/TabMotion";
import { StaggerEnter, StaggerItem } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { SecurityCheck, TrustScoreBreakdown } from "@/types/security";

interface TrustScoreBreakdownProps {
  breakdown: TrustScoreBreakdown;
}

const STATUS_VARIANT = {
  pass: "success",
  warning: "warning",
  fail: "danger",
  unknown: "muted",
} as const;

function SecurityCheckRow({ check }: { check: SecurityCheck }) {
  const [open, setOpen] = useState(false);
  const hasProof = Boolean(check.evidence?.findings.length);

  return (
    <li className="overflow-hidden rounded-lg border border-border bg-muted/30">
      <button
        type="button"
        className={cn(
          "flex w-full items-start justify-between gap-2 px-3 py-2 text-left",
          hasProof && "hover:bg-muted/50",
          !hasProof && "cursor-default",
        )}
        onClick={() => hasProof && setOpen((value) => !value)}
        aria-expanded={hasProof ? open : undefined}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {hasProof ? (
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            ) : null}
            <p className="text-sm font-medium text-foreground">{check.label}</p>
          </div>
          {check.detail ? (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{check.detail}</p>
          ) : null}
          {check.id === "ssl" && check.sslGrade ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              SSL Labs grade: {check.sslGrade}
            </p>
          ) : null}
        </div>
        <Badge variant={STATUS_VARIANT[check.status]}>{check.status}</Badge>
      </button>

      {hasProof && check.evidence ? (
        <CollapseMotion
          open={open}
          className="space-y-2 border-t border-border bg-background/60 px-3 py-2.5"
        >
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Method:</span> {check.evidence.method}
              </p>
              {check.evidence.target ? (
                <p className="break-all">
                  <span className="font-medium text-foreground">Target:</span>{" "}
                  {check.evidence.target}
                </p>
              ) : null}
              {check.evidence.tool ? (
                <p>
                  <span className="font-medium text-foreground">Tool:</span>{" "}
                  {check.evidence.tool}
                </p>
              ) : null}
              <p>
                <span className="font-medium text-foreground">Tested:</span>{" "}
                {new Date(check.evidence.testedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-foreground">Findings</p>
              <ul className="mt-1 space-y-1">
                {check.evidence.findings.map((finding, index) => (
                  <li
                    key={`${check.id}-finding-${index}`}
                    className="rounded-md bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
        </CollapseMotion>
      ) : null}
    </li>
  );
}

export function TrustScoreBreakdownPanel({ breakdown }: TrustScoreBreakdownProps) {
  const trustLabel = breakdown.trustLabel ?? "High";

  return (
    <Card className="min-w-0 border-border bg-card">
      <div className="mb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Security breakdown</h2>
          <Link
            href="/methodology"
            className="text-xs font-medium text-primary hover:underline"
          >
            Why this score? →
          </Link>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {trustLabel} trust — scanned{" "}
          {new Date(breakdown.lastScannedAt).toLocaleDateString()}. Expand a check to view test
          proof.
        </p>
        {breakdown.phase2 ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Composite score {breakdown.phase2.compositeScore}
            {breakdown.phase2.sourceCount > 1
              ? ` · ${breakdown.phase2.sourceCount} discovery sources`
              : null}
          </p>
        ) : null}
      </div>

      <StaggerEnter className="grid gap-2 sm:grid-cols-2">
        {breakdown.checks.map((check) => (
          <StaggerItem key={check.id}>
            <SecurityCheckRow check={check} />
          </StaggerItem>
        ))}
      </StaggerEnter>
    </Card>
  );
}
