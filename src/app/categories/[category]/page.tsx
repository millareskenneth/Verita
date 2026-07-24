import { notFound } from "next/navigation";
import { ApiGrid } from "@/components/catalog/ApiGrid";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { searchApis } from "@/lib/api/client";
import { API_CATEGORIES } from "@/lib/constants/categories";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{categoryMeta.label}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Free APIs in the {categoryMeta.label.toLowerCase()} category.
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter activeCategory={category} />
      </div>

      <ApiGrid items={result.items} />
    </div>
  );
}
