import { Suspense } from "react";
import Link from "next/link";

import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SortSelect } from "@/components/catalog/SortSelect";
import { searchApis } from "@/lib/api/client";
import type { SortOption, CatalogReadinessStatus } from "@/types/api";

interface ApisPageProps {
  searchParams: Promise<{
    sort?: SortOption;
    page?: string;
    readiness?: CatalogReadinessStatus;
  }>;
}

const PAGE_SIZE = 24;

export default async function ApisPage({ searchParams }: ApisPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const sort = params.sort ?? "popularity";
  const readiness = params.readiness;

  const result = await searchApis({
    sort,
    readiness,
    page,
    limit: PAGE_SIZE,
  });

  const showingFrom = result.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, result.total);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API catalog</h1>
          <p className="mt-2 text-muted-foreground">
            Searchable catalog of free and open-source APIs with trust scores.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <CategoryFilter />
        <span className="mx-1 hidden h-4 w-px bg-border sm:inline-block" aria-hidden />
        <Link
          href="/apis?readiness=plug-and-play"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            readiness === "plug-and-play"
              ? "bg-emerald-600 text-white"
              : "border border-border bg-card text-foreground hover:border-border-accent"
          }`}
        >
          Ready to use
        </Link>
        <Link
          href="/apis"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            !readiness
              ? "border border-border bg-muted/40 text-muted-foreground"
              : "border border-border bg-card text-foreground hover:border-border-accent"
          }`}
        >
          All APIs
        </Link>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {result.total === 0
          ? "No APIs found."
          : `Showing ${showingFrom}–${showingTo} of ${result.total} APIs`}
      </p>

      <ApiGrid items={result.items} />

      <CatalogPagination
        page={page}
        limit={PAGE_SIZE}
        total={result.total}
        searchParams={{
          sort: sort === "popularity" ? undefined : sort,
          readiness,
        }}
      />
    </div>
  );
}
