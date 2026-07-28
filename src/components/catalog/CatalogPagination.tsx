import Link from "next/link";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  basePath: string;
  page: number;
  total: number;
  limit: number;
  queryParams?: Record<string, string | undefined>;
}

function buildPageHref(
  basePath: string,
  page: number,
  queryParams?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
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

function getVisiblePages(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

const linkClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary";

const activeLinkClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground";

export function CatalogPagination({
  basePath,
  page,
  total,
  limit,
  queryParams,
}: CatalogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Catalog pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasPrevious ? (
          <Link
            href={buildPageHref(basePath, page - 1, queryParams)}
            className={linkClass}
            aria-label="Previous page"
          >
            Previous
          </Link>
        ) : (
          <span
            className={cn(linkClass, "cursor-not-allowed opacity-50")}
            aria-disabled="true"
          >
            Previous
          </span>
        )}

        <div className="flex items-center gap-1">
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <Link
                key={item}
                href={buildPageHref(basePath, item, queryParams)}
                className={item === page ? activeLinkClass : linkClass}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Link>
            ),
          )}
        </div>

        {hasNext ? (
          <Link
            href={buildPageHref(basePath, page + 1, queryParams)}
            className={linkClass}
            aria-label="Next page"
          >
            Next
          </Link>
        ) : (
          <span
            className={cn(linkClass, "cursor-not-allowed opacity-50")}
            aria-disabled="true"
          >
            Next
          </span>
        )}
      </div>
    </nav>
  );
}

export function catalogResultRange(
  page: number,
  limit: number,
  total: number,
  itemCount: number,
): string {
  if (total === 0 || itemCount === 0) {
    return "Showing 0 of 0 APIs";
  }

  const start = (page - 1) * limit + 1;
  const end = start + itemCount - 1;
  return `Showing ${start}–${end} of ${total} APIs`;
}
