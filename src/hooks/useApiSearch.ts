"use client";

import { useMemo, useState } from "react";
import type { ApiSearchParams } from "@/types/api";
import { searchMockApis } from "@/data/mock-apis";

export function useApiSearch(params: ApiSearchParams = {}) {
  const [query, setQuery] = useState(params.query ?? "");

  const result = useMemo(
    () => searchMockApis({ ...params, query }),
    [params, query],
  );

  return {
    query,
    setQuery,
    result,
  };
}
