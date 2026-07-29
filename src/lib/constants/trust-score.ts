export const TRUST_SCORE_LABELS = {
  high: "High trust",
  medium: "Medium trust",
  low: "Low trust",
} as const;

export const HERO_TRUST_SUMMARY =
  "Every API is checked for known vulnerabilities, valid SSL, license clarity, and active maintenance before it's listed.";

export const TRUST_SCORE_BANDS = [
  {
    label: TRUST_SCORE_LABELS.high,
    variant: "success" as const,
    meaning:
      "Passed all checks — valid SSL, no known critical vulnerabilities, clear license, actively maintained.",
  },
  {
    label: TRUST_SCORE_LABELS.medium,
    variant: "warning" as const,
    meaning:
      "Passed most checks — minor issues found, worth reviewing before production use.",
  },
  {
    label: TRUST_SCORE_LABELS.low,
    variant: "danger" as const,
    meaning:
      "Multiple issues found, or a critical vulnerability detected — review carefully or avoid.",
  },
] as const;

export function getTrustLabel(score: number): {
  label: (typeof TRUST_SCORE_LABELS)[keyof typeof TRUST_SCORE_LABELS];
  variant: "success" | "warning" | "danger";
  trustLabel: "High" | "Medium" | "Low";
} {
  if (score >= 84) {
    return { label: TRUST_SCORE_LABELS.high, variant: "success", trustLabel: "High" };
  }
  if (score >= 60) {
    return { label: TRUST_SCORE_LABELS.medium, variant: "warning", trustLabel: "Medium" };
  }
  return { label: TRUST_SCORE_LABELS.low, variant: "danger", trustLabel: "Low" };
}

/** Prefer API-provided trustLabel (from security checks) over numeric score bands. */
export function getDisplayTrust(api: {
  trustScore: number;
  trustLabel?: "High" | "Medium" | "Low";
}): {
  label: (typeof TRUST_SCORE_LABELS)[keyof typeof TRUST_SCORE_LABELS];
  variant: "success" | "warning" | "danger";
} {
  if (api.trustLabel) {
    const variant =
      api.trustLabel === "High"
        ? "success"
        : api.trustLabel === "Medium"
          ? "warning"
          : "danger";
    return {
      label: TRUST_SCORE_LABELS[api.trustLabel.toLowerCase() as keyof typeof TRUST_SCORE_LABELS],
      variant,
    };
  }

  const derived = getTrustLabel(api.trustScore);
  return { label: derived.label, variant: derived.variant };
}

export const TRUST_VARIANT_STYLES = {
  success: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  warning: {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  danger: {
    badge: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    bar: "bg-red-500",
  },
} as const;
