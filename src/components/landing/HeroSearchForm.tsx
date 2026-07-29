"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/shadcn/button";

interface HeroSearchFormProps {
  placeholder?: string;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function HeroSearchForm({
  placeholder = "Search 500+ free APIs by name, use case, or tag...",
}: HeroSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md border border-input bg-background px-3 shadow-sm transition-[color,box-shadow] has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
        <SearchIcon />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Search free APIs"
          className="h-12 min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
      <Button type="submit" size="lg" className="h-12 shrink-0 px-6">
        Search
      </Button>
    </form>
  );
}
