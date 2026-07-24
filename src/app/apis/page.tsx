import { Suspense } from "react";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SortSelect } from "@/components/catalog/SortSelect";
import { searchApis } from "@/lib/api/client";
import type { SortOption } from "@/types/api";

interface ApisPageProps {
  searchParams: Promise<{
    sort?: SortOption;
  }>;
}

export default async function ApisPage({ searchParams }: ApisPageProps) {
  const params = await searchParams;
  const result = await searchApis({
    sort: params.sort ?? "popularity",
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API catalog</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Searchable catalog of free and open-source APIs with trust scores.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter />
      </div>

      <p className="mb-6 text-sm text-zinc-500">
        Showing {result.items.length} of {result.total} APIs
      </p>

      <ApiGrid items={result.items} />
    </div>
  );
}
