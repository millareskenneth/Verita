"use client";

import { ApiCard } from "@/components/catalog/ApiCard";
import { StaggerEnter, StaggerItem } from "@/components/motion/Reveal";
import type { ApiCatalogEntry } from "@/types/api";

interface ApiGridProps {
  items: ApiCatalogEntry[];
  emptyMessage?: string;
  animate?: boolean;
}

export function ApiGrid({
  items,
  emptyMessage = "No APIs matched your search.",
  animate = true,
}: ApiGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  if (!animate) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((api) => (
          <ApiCard key={api.id} api={api} />
        ))}
      </div>
    );
  }

  return (
    <StaggerEnter className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((api) => (
        <StaggerItem key={api.id}>
          <ApiCard api={api} />
        </StaggerItem>
      ))}
    </StaggerEnter>
  );
}
