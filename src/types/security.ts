export type SecurityCheckStatus = "pass" | "fail" | "warning" | "unknown";

export type RiskLevel = "low" | "medium" | "high";

export interface SecurityCheckEvidence {
  method: string;
  target?: string;
  testedAt: string;
  findings: string[];
  tool?: string;
}

export interface SecurityCheck {
  id: string;
  label: string;
  status: SecurityCheckStatus;
  detail?: string;
  evidence?: SecurityCheckEvidence;
}

export interface TrustScoreBreakdown {
  overall: number;
  riskLevel: RiskLevel;
  checks: SecurityCheck[];
  lastScannedAt: string;
}
