import Link from "next/link";

import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  page: number;
  limit: number;
  total: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}

function buildHref(
  page: number,
  basePath: string,
  searchParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") {
        params.set(key, value);
      }
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CatalogPagination({
  page,
  limit,
  total,
  basePath = "/apis",
  searchParams,
}: CatalogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) {
    return null;
  }

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Catalog pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} APIs total
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={buildHref(prevPage, basePath, searchParams)}
          aria-disabled={page <= 1}
          className={cn(
            "rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors",
            page <= 1
              ? "pointer-events-none opacity-40"
              : "hover:border-border-accent hover:bg-muted/40",
          )}
        >
          Previous
        </Link>
        <Link
          href={buildHref(nextPage, basePath, searchParams)}
          aria-disabled={page >= totalPages}
          className={cn(
            "rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors",
            page >= totalPages
              ? "pointer-events-none opacity-40"
              : "hover:border-border-accent hover:bg-muted/40",
          )}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}
