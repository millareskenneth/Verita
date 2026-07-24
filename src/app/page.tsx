import Link from "next/link";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SearchBar } from "@/components/catalog/SearchBar";
import { Button } from "@/components/ui/Button";
import { searchApis } from "@/lib/api/client";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/lib/constants/config";

export default async function HomePage() {
  const featured = await searchApis({ sort: "popularity", limit: 3 });

  return (
    <div>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              {APP_TAGLINE}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Find free APIs you can trust, test, and ship faster.
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {APP_DESCRIPTION}
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/apis">Browse catalog</Button>
            <Button href="/submit" variant="secondary">
              Suggest an API
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured APIs</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Phase 1 MVP uses a curated seed catalog while backend automation is
              built.
            </p>
          </div>
          <Link
            href="/apis"
            className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            View all
          </Link>
        </div>
        <ApiGrid items={featured.items} />
      </section>

      <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold">Browse by category</h2>
          <div className="mt-6">
            <CategoryFilter />
          </div>
        </div>
      </section>
    </div>
  );
}
