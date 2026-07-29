import type { ApiCatalogEntry } from "@/types/api";

export type CatalogReadinessStatus =
  | "plug-and-play"
  | "api-key-required"
  | "docs-only";

const REPO_HOST_SUFFIXES = ["github.com", "gitlab.com", "bitbucket.org"];

function isRepositoryOrDocsHost(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    return REPO_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
  } catch {
    return true;
  }
}

/** Mirror of backend catalog_readiness.get_readiness_status for mock/offline fallback. */
export function getReadinessStatus(api: ApiCatalogEntry): CatalogReadinessStatus {
  if (api.readinessStatus) {
    return api.readinessStatus;
  }

  const endpointCount = api.endpoints.length;

  if (endpointCount === 0 || isRepositoryOrDocsHost(api.baseUrl)) {
    return "docs-only";
  }

  if (
    api.freeStatus === "quarantined" ||
    api.freeStatus === "delisted" ||
    api.freeStatus === "under-review"
  ) {
    return "docs-only";
  }

  if (api.authMethod === "oauth") {
    return "docs-only";
  }

  if (api.authMethod === "none" && api.freeStatus === "free") {
    return "plug-and-play";
  }

  if (api.authMethod === "api-key" || api.authMethod === "basic" || api.freeStatus === "free-tier") {
    return "api-key-required";
  }

  return "docs-only";
}

export const READINESS_LABELS: Record<
  CatalogReadinessStatus,
  { label: string; hint: string }
> = {
  "plug-and-play": {
    label: "Ready to use",
    hint: "Try it on Verita — no API key or signup needed.",
  },
  "api-key-required": {
    label: "API key required",
    hint: "Endpoints are documented here, but you need a key from the provider.",
  },
  "docs-only": {
    label: "Docs only",
    hint: "Visit the official source — not ready to test on Verita yet.",
  },
};

export const READINESS_STYLES: Record<CatalogReadinessStatus, string> = {
  "plug-and-play":
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "api-key-required":
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400",
  "docs-only": "border-border bg-muted/50 text-muted-foreground",
};
