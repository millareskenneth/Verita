import { ApiCard } from "@/components/catalog/ApiCard";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiGridProps {
  items: ApiCatalogEntry[];
  emptyMessage?: string;
}

export function ApiGrid({
  items,
  emptyMessage = "No APIs matched your search.",
}: ApiGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center text-zinc-500 dark:border-zinc-700">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((api) => (
        <ApiCard key={api.id} api={api} />
      ))}
    </div>
  );
}
