import type { ApiCatalogEntry } from "@/types/api";

interface RecommendationBannerProps {
  api: ApiCatalogEntry;
}

export function RecommendationBanner({ api }: RecommendationBannerProps) {
  if (!api.recommendationWarning) {
    return null;
  }

  const isDelisted = api.freeStatus === "delisted";

  return (
    <div
      className={`mb-8 rounded-xl border px-4 py-4 sm:px-5 ${
        isDelisted
          ? "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
          : "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
      }`}
      role="alert"
    >
      <p className="text-sm font-semibold uppercase tracking-wide">
        Not recommended
      </p>
      <p className="mt-2 text-sm leading-6">{api.recommendationWarning}</p>
    </div>
  );
}
