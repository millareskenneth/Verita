export const TRUST_SCORE_DISCLAIMER =
  "Trust scores are advisory and do not guarantee safety. Verita cannot detect all vulnerabilities. Review upstream terms and conduct your own security review before production use.";

export const FOOTER_DISCLAIMER =
  "Trust scores are advisory and do not guarantee safety. Always review upstream terms before production use.";

export const SUBMISSION_COMPLIANCE_NOTE =
  "We only index APIs with official documentation or repositories and permissive open-source licenses. Submissions must link to a public source we can verify.";

export const FOOTER_LEGAL_LINKS = [
  { href: "/methodology", label: "Trust score methodology" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export const SUBMISSION_SECURITY_NOTE =
  "Submitted APIs go through the same automated security checks before being listed.";
