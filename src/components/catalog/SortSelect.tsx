"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { SORT_OPTIONS } from "@/lib/constants/categories";
import type { SortOption } from "@/types/api";

interface SortSelectProps {
  basePath?: string;
}

export function SortSelect({ basePath = "/apis" }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as SortOption | null) ?? "popularity";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", event.target.value);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <Select
      label="Sort by"
      name="sort"
      value={currentSort}
      onChange={handleChange}
      options={SORT_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    />
  );
}
