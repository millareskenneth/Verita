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
      <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((api) => (
        <ApiCard key={api.id} api={api} />
      ))}
    </div>
  );
}
