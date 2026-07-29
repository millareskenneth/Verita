"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CatalogSearchInputProps {
  basePath?: string;
}

export function CatalogSearchInput({ basePath = "/apis" }: CatalogSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const trimmed = value.trim();
    const current = urlQuery.trim();
    if (trimmed === current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      params.delete("page");
      const query = params.toString();
      router.push(query ? `${basePath}?${query}` : basePath);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [basePath, router, searchParams, urlQuery, value]);

  return (
    <label className="block w-full">
      <span className="sr-only">Search APIs</span>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search for APIs"
          className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-3 text-sm text-foreground outline-none ring-primary placeholder:text-muted-foreground focus:ring-2"
        />
      </div>
    </label>
  );
}
