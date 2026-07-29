"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { SORT_OPTIONS } from "@/lib/constants/categories";
import type { SortOption } from "@/types/api";

interface SortSelectProps {
  basePath?: string;
  compact?: boolean;
}

export function SortSelect({ basePath = "/apis", compact = false }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as SortOption | null) ?? "popularity";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", event.target.value);
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <Select
      label={compact ? undefined : "Sort by"}
      aria-label={compact ? "Sort by" : undefined}
      name="sort"
      value={currentSort}
      onChange={handleChange}
      className={compact ? "py-1.5" : undefined}
      options={SORT_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    />
  );
}
