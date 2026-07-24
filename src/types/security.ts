export type SecurityCheckStatus = "pass" | "fail" | "warning" | "unknown";

export type RiskLevel = "low" | "medium" | "high";

export interface SecurityCheck {
  id: string;
  label: string;
  status: SecurityCheckStatus;
  detail?: string;
}

export interface TrustScoreBreakdown {
  overall: number;
  riskLevel: RiskLevel;
  checks: SecurityCheck[];
  lastScannedAt: string;
}
