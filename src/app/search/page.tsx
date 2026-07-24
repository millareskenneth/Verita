import { Suspense } from "react";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SearchBar } from "@/components/catalog/SearchBar";
import { searchApis } from "@/lib/api/client";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const result = await searchApis({ query, limit: 12 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Search APIs</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Full-text search across names, descriptions, and tags.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <SearchBar defaultQuery={query} />
          </Suspense>
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter />
      </div>

      <p className="mb-6 text-sm text-zinc-500">
        {query
          ? `${result.total} result${result.total === 1 ? "" : "s"} for "${query}"`
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
    </div>
  );
}
