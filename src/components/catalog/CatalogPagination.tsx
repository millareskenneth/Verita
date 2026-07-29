import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  buildCatalogHref,
  buildPageItems,
} from "@/lib/utils/catalog-url";

interface CatalogPaginationProps {
  page: number;
  limit: number;
  total: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
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
  const pageItems = buildPageItems(page, totalPages);

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Catalog pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} APIs total
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <PaginationLink
          href={buildCatalogHref(basePath, prevPage, searchParams)}
          disabled={page <= 1}
          label="Previous page"
        >
          Previous
        </PaginationLink>

        <ol className="flex items-center gap-1">
          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <li
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item}>
                <PaginationLink
                  href={buildCatalogHref(basePath, item, searchParams)}
                  active={item === page}
                  label={`Page ${item}`}
                >
                  {item}
                </PaginationLink>
              </li>
            ),
          )}
        </ol>

        <PaginationLink
          href={buildCatalogHref(basePath, nextPage, searchParams)}
          disabled={page >= totalPages}
          label="Next page"
        >
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  disabled = false,
  active = false,
  label,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className="rounded-lg border border-border px-3 py-2 text-sm font-medium opacity-40"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:border-border-accent hover:bg-muted/40",
      )}
    >
      {children}
    </Link>
  );
}
