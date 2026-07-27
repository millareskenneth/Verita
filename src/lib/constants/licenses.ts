import type { LicenseType } from "@/types/api";

const SPDX_BASE = "https://spdx.org/licenses";

export const LICENSE_URLS: Record<LicenseType, string | null> = {
  MIT: `${SPDX_BASE}/MIT.html`,
  "Apache-2.0": `${SPDX_BASE}/Apache-2.0.html`,
  "GPL-3.0": `${SPDX_BASE}/GPL-3.0-only.html`,
  "BSD-3-Clause": `${SPDX_BASE}/BSD-3-Clause.html`,
  Other: null,
};

export function getLicenseUrl(license: LicenseType): string | null {
  return LICENSE_URLS[license];
}

export function requiresLicenseVerification(license: LicenseType): boolean {
  return license === "Other";
}
