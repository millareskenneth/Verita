"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { FormEvent, useState } from "react";

import { landingShellClass } from "@/lib/layout/site-shell";
import { TesterPreview } from "@/components/landing/TesterPreview";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { APP_DESCRIPTION } from "@/lib/constants/config";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border",
        "lg:flex lg:min-h-[calc(100dvh-3.75rem)] lg:flex-col lg:justify-center",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)/0.15,transparent)]" />

      <div
        className={cn(
          landingShellClass,
          "relative grid w-full gap-8 py-10 sm:py-12",
          "lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-8",
        )}
      >
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Find free APIs you can{" "}
            <span className="text-primary">trust, test,</span> and ship faster.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
            {APP_DESCRIPTION} Browse curated docs, run live requests in your
            browser, and see security scores before you integrate.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search APIs by name, use case, or tag..."
                className="h-11 pl-10"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 shrink-0 px-6">
              Search catalog
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="outline">
              <Link href="/apis">
                Browse all APIs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/submit">Suggest an API</Link>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:gap-6">
            <div>
              <dt className="font-display text-2xl font-semibold tabular-nums">50+</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Curated APIs</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-semibold tabular-nums">Live</dt>
              <dd className="mt-1 text-sm text-muted-foreground">In-browser testing</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-semibold tabular-nums">Trust</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Security scores</dd>
            </div>
          </dl>
        </div>

        <TesterPreview className="lg:max-h-[min(520px,calc(100dvh-8rem))]" editorHeight="280px" />
      </div>

      <a
        href="#landing-content"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground lg:flex"
      >
        <span>Scroll to explore</span>
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
