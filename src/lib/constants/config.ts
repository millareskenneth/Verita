export const APP_NAME = "Verita";

export const APP_TAGLINE = "Free API Discovery and Security Hub";

export const APP_DESCRIPTION =
  "Discover, document, test, and evaluate free open-source APIs in one place.";

export const HERO_MICRO_TRUST = "No signup required to test an API.";

export const HERO_SEARCH_PLACEHOLDER =
  "Search 500+ free APIs by name, use case, or tag...";

export const HERO_STATS = [
  { value: "120+", label: "APIs indexed" },
  { value: "100%", label: "Security-scanned" },
  { value: "Free forever", label: "No paywall" },
] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
