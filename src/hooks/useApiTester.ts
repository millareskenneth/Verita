"use client";

import { useMemo, useState } from "react";

export function useApiTester(baseUrl: string, initialPath = "/") {
  const [path, setPath] = useState(initialPath);
  const [query, setQuery] = useState("");

  const requestUrl = useMemo(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${baseUrl}${normalizedPath}`;
    return query.trim() ? `${url}?${query.trim()}` : url;
  }, [baseUrl, path, query]);

  return {
    path,
    setPath,
    query,
    setQuery,
    requestUrl,
  };
}
