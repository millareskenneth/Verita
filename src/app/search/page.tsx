import { Suspense } from "react";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import {
  CatalogPagination,
  catalogResultRange,
} from "@/components/catalog/CatalogPagination";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SearchBar } from "@/components/catalog/SearchBar";
import { apiPageShellClass } from "@/lib/layout/site-shell";
import { searchApis } from "@/lib/api/client";

const PAGE_SIZE = 12;

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const result = await searchApis({ query, page, limit: PAGE_SIZE });

  return (
    <div className={apiPageShellClass}>
      <div className="mb-4 max-w-2xl">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Search APIs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full-text search across names, descriptions, and tags.
        </p>
        <div className="mt-4">
          <Suspense fallback={null}>
            <SearchBar defaultQuery={query} />
          </Suspense>
        </div>
      </div>

      <div className="mb-4">
        <CategoryFilter />
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {query
          ? catalogResultRange(page, PAGE_SIZE, result.total, result.items.length)
          : "Enter a query to search the catalog"}
      </p>

      <ApiGrid
        items={result.items}
        emptyMessage={
          query
            ? `No APIs matched "${query}".`
            : "Start typing to search the catalog."
        }
      />

      {query ? (
        <CatalogPagination
          basePath="/search"
          page={page}
          total={result.total}
          limit={PAGE_SIZE}
          queryParams={{ q: query }}
        />
      ) : null}
    </div>
  );
}
