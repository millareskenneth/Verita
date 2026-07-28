import { Suspense } from "react";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import {
  CatalogPagination,
  catalogResultRange,
} from "@/components/catalog/CatalogPagination";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SortSelect } from "@/components/catalog/SortSelect";
import { apiPageShellClass } from "@/lib/layout/site-shell";
import { searchApis } from "@/lib/api/client";
import type { SortOption } from "@/types/api";

const PAGE_SIZE = 12;

interface ApisPageProps {
  searchParams: Promise<{
    sort?: SortOption;
    page?: string;
  }>;
}

export default async function ApisPage({ searchParams }: ApisPageProps) {
  const params = await searchParams;
  const sort = params.sort ?? "popularity";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const result = await searchApis({
    sort,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className={apiPageShellClass}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            API catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Searchable catalog of free and open-source APIs with trust scores.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="mb-4">
        <CategoryFilter />
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {catalogResultRange(page, PAGE_SIZE, result.total, result.items.length)}
      </p>

      <ApiGrid items={result.items} />

      <CatalogPagination
        basePath="/apis"
        page={page}
        total={result.total}
        limit={PAGE_SIZE}
        queryParams={{ sort: sort === "popularity" ? undefined : sort }}
      />
    </div>
  );
}
