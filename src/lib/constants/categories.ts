export const API_CATEGORIES = [
  { slug: "weather", label: "Weather" },
  { slug: "finance", label: "Finance" },
  { slug: "ai-ml", label: "AI / ML" },
  { slug: "geolocation", label: "Geolocation" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "utilities", label: "Utilities" },
] as const;

export type ApiCategorySlug = (typeof API_CATEGORIES)[number]["slug"];

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "trust-score", label: "Trust score" },
  { value: "last-updated", label: "Last updated" },
  { value: "doc-completeness", label: "Documentation" },
] as const;
