"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

interface HeroSearchFormProps {
  placeholder?: string;
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
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-12 bg-background/80 pl-10 text-base shadow-sm backdrop-blur-sm"
          aria-label="Search free APIs"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 shrink-0 px-6">
        Search
      </Button>
    </form>
  );
}
