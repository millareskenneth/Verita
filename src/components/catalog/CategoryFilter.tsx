import Link from "next/link";
import { API_CATEGORIES } from "@/lib/constants/categories";

interface CategoryFilterProps {
  activeCategory?: string;
}

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/apis"
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-emerald-600 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        }`}
      >
        All
      </Link>
      {API_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.slug;

        return (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
