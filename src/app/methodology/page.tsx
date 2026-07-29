import type { Metadata } from "next";

import {
  MethodologyPageShell,
  MethodologySection,
} from "@/components/methodology/MethodologyPageShell";
import { Badge } from "@/components/ui/Badge";
import { APP_NAME } from "@/lib/constants/config";
import { TRUST_SCORE_BANDS } from "@/lib/constants/trust-score";

export const metadata: Metadata = {
  title: "Trust Score Methodology",
  description: `How ${APP_NAME} evaluates API security, licensing, and maintenance before listing an API in the catalog.`,
};

const CHECKS = [
  {
    title: "SSL/TLS validity",
    description: "Is the connection properly encrypted?",
  },
  {
    title: "Known vulnerabilities",
    description:
      "Does this API or its dependencies have any publicly known security issues?",
  },
  {
    title: "License clarity",
    description:
      "Is it clearly open-source and free to use (MIT, Apache 2.0, GPL, BSD, etc.)?",
  },
  {
    title: "Maintenance activity",
    description: "Has the project been updated recently, or does it look abandoned?",
  },
  {
    title: "Domain reputation",
    description:
      "Has this domain been flagged as malicious or suspicious anywhere?",
  },
] as const;

export default function MethodologyPage() {
  return (
    <MethodologyPageShell
      title="Trust score methodology"
      description={`How ${APP_NAME} evaluates every API before it appears in the catalog — and how we keep scores up to date.`}
    >
      <MethodologySection id="intro">
        <p>
          Every API listed on {APP_NAME} goes through an automated security check
          before it&apos;s added to the catalog, and gets re-checked on a regular
          schedule afterward. The trust score summarizes what we found — SSL
          configuration, known vulnerabilities, license clarity, and how actively
          the API is maintained — so you can make an informed decision before
          integrating it into your own project.
        </p>
      </MethodologySection>

      <MethodologySection id="what-we-check" title="What gets checked">
        <ul className="space-y-4">
          {CHECKS.map((check) => (
            <li key={check.title} className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <div>
                <p className="font-medium text-foreground">{check.title}</p>
                <p className="mt-1 text-muted-foreground">{check.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </MethodologySection>

      <MethodologySection id="how-scores-work" title="How the score is calculated">
        <p>
          Each check produces a pass, warning, or fail result that rolls up into an
          overall trust label. Vulnerability severity uses{" "}
          <strong>CVSS</strong> (Common Vulnerability Scoring System) — the same
          industry-standard scale used by the National Vulnerability Database — so
          critical issues are weighted more heavily than minor ones.
        </p>
        <p>
          Popularity and maintenance signals use statistically adjusted methods — such
          as the Wilson score interval and exponential decay on last-update dates —
          so new or small projects aren&apos;t unfairly penalized or inflated by a
          handful of stars or a single recent commit.
        </p>
        <p>
          Checks are <strong>re-run on a schedule</strong>, not just once at listing
          time. A score reflects the API&apos;s current status, not a one-time
          snapshot from when it was first added.
        </p>

        <details className="group rounded-xl border border-border bg-muted/30">
          <summary className="cursor-pointer list-none px-4 py-3 font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              Show technical details
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </span>
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Phase 1 (current):</strong>{" "}
              Rule-based pass/fail checks. An API earns{" "}
              <strong className="text-foreground">High trust</strong> when all checks
              pass, <strong className="text-foreground">Medium trust</strong> when one
              check fails, and <strong className="text-foreground">Low trust</strong> when
              two or more fail or any critical vulnerability (CVSS ≥ 9.0) is found.
            </p>
            <p>
              <strong className="text-foreground">Phase 2+:</strong> A weighted numeric
              score combining CVSS-based vulnerability penalty, confidence-adjusted
              popularity (Wilson score), SSL grade, freshness decay, and license
              clarity. Formulas follow published standards rather than arbitrary
              weights.
            </p>
            <p>
              Vulnerability aggregation uses the <strong>maximum</strong> CVSS score
              among all findings — one critical issue is never diluted by several
              low-severity ones.
            </p>
            <p>
              Freshness scoring uses exponential decay (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                e^(-λ × days_since_last_update)
              </code>
              ) rather than a hard cutoff, producing a smooth maintenance signal.
            </p>
          </div>
        </details>
      </MethodologySection>

      <MethodologySection id="trust-bands" title="Trust score bands">
        <p className="text-muted-foreground">
          Every API in the catalog is labeled with one of three trust levels. The same
          labels appear on catalog cards, API detail pages, and throughout the site.
        </p>
        <ul className="space-y-3">
          {TRUST_SCORE_BANDS.map((band) => (
            <li
              key={band.label}
              className="rounded-xl border border-border px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={band.variant}>{band.label}</Badge>
              </div>
              <p className="mt-2 text-muted-foreground">{band.meaning}</p>
            </li>
          ))}
        </ul>
      </MethodologySection>

      <MethodologySection id="limitations" title="Limitations">
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-4">
          <p>
            Trust scores are advisory, not a guarantee of safety. Automated scanning
            can&apos;t catch every possible issue, and a provider&apos;s security
            posture can change after our last scan. Always review an API&apos;s own
            documentation and security practices before using it in production.
          </p>
        </div>
      </MethodologySection>

      <MethodologySection id="contributors" title="For contributors">
        <p>
          Community-submitted APIs go through the exact same automated pipeline as
          auto-discovered ones. There is no &ldquo;trusted by default&rdquo; shortcut —
          every entry must pass the same checks before it appears in the catalog.
        </p>
      </MethodologySection>
    </MethodologyPageShell>
  );
}
