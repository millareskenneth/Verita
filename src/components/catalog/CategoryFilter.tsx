import Link from "next/link";
import { API_CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeCategory?: string;
}

const inactiveClass =
  "bg-secondary text-secondary-foreground hover:bg-secondary/80";

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/apis"
        className={cn(
          "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          !activeCategory ? "bg-primary text-primary-foreground" : inactiveClass,
        )}
      >
        All
      </Link>
      {API_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.slug;

        return (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : inactiveClass,
            )}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
