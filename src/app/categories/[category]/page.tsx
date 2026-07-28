import { notFound } from "next/navigation";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import {
  CatalogPagination,
  catalogResultRange,
} from "@/components/catalog/CatalogPagination";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { apiPageShellClass } from "@/lib/layout/site-shell";
import { searchApis } from "@/lib/api/client";
import { API_CATEGORIES } from "@/lib/constants/categories";

const PAGE_SIZE = 12;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return API_CATEGORIES.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryMeta = API_CATEGORIES.find((item) => item.slug === category);

  if (!categoryMeta) {
    notFound();
  }

  const result = await searchApis({ category, limit: 12 });

  return (
    <div className={apiPageShellClass}>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {categoryMeta.label}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free APIs in the {categoryMeta.label.toLowerCase()} category.
        </p>
      </div>

      <div className="mb-4">
        <CategoryFilter activeCategory={category} />
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {catalogResultRange(page, PAGE_SIZE, result.total, result.items.length)}
      </p>

      <ApiGrid items={result.items} />

      <CatalogPagination
        basePath={`/categories/${category}`}
        page={page}
        total={result.total}
        limit={PAGE_SIZE}
      />
    </div>
  );
}
