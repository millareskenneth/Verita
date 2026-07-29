import { Suspense } from "react";
import Link from "next/link";

import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CatalogSearchInput } from "@/components/catalog/CatalogSearchInput";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SortSelect } from "@/components/catalog/SortSelect";
import { searchApis } from "@/lib/api/client";
import type { SortOption, CatalogReadinessStatus } from "@/types/api";

interface ApisPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: SortOption;
    page?: string;
    readiness?: CatalogReadinessStatus;
  }>;
}

const PAGE_SIZE = 24;

export default async function ApisPage({ searchParams }: ApisPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const sort = params.sort ?? "popularity";
  const readiness = params.readiness;

  const result = await searchApis({
    query: query || undefined,
    sort,
    readiness,
    page,
    limit: PAGE_SIZE,
  });

  const showingFrom = result.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, result.total);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">API catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Searchable catalog of free and open-source APIs with trust scores.
        </p>
      </div>

      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <CategoryFilter />
          <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
            <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Suspense fallback={null}>
                <CatalogSearchInput />
              </Suspense>
            </div>
            <div className="w-36 shrink-0 sm:w-40">
              <Suspense fallback={null}>
                <SortSelect compact />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={query ? `/apis?q=${encodeURIComponent(query)}&readiness=plug-and-play` : "/apis?readiness=plug-and-play"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              readiness === "plug-and-play"
                ? "bg-emerald-600 text-white"
                : "border border-border bg-card text-foreground hover:border-border-accent"
            }`}
          >
            Ready to use
          </Link>
          <Link
            href={query ? `/apis?q=${encodeURIComponent(query)}` : "/apis"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !readiness
                ? "border border-border bg-muted/40 text-muted-foreground"
                : "border border-border bg-card text-foreground hover:border-border-accent"
            }`}
          >
            All APIs
          </Link>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {result.total === 0
          ? query
            ? `No APIs found for "${query}".`
            : "No APIs found."
          : query
            ? `Showing ${showingFrom}–${showingTo} of ${result.total} results for "${query}"`
            : `Showing ${showingFrom}–${showingTo} of ${result.total} APIs`}
      </p>

      <ApiGrid
        items={result.items}
        emptyMessage={
          query
            ? `No APIs matched "${query}". Try a broader keyword like a category or tag.`
            : "No APIs matched your filters."
        }
      />

      <CatalogPagination
        page={page}
        limit={PAGE_SIZE}
        total={result.total}
        searchParams={{
          q: query || undefined,
          sort: sort === "popularity" ? undefined : sort,
          readiness,
        }}
      />
    </div>
  );
}
