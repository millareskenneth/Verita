import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { HeroSearchForm } from "@/components/landing/HeroSearchForm";
import { landingShellClass } from "@/components/landing/landing-shell";
import { Button } from "@/components/ui/shadcn/button";
import {
  APP_DESCRIPTION,
  HERO_MICRO_TRUST,
  HERO_SEARCH_PLACEHOLDER,
  HERO_STATS,
} from "@/lib/constants/config";
import { searchApis } from "@/lib/api/client";
import { HERO_TRUST_SUMMARY } from "@/lib/constants/trust-score";
import { cn } from "@/lib/utils";

function formatApiCount(total: number): string {
  if (total >= 100) {
    return `${Math.floor(total / 10) * 10}+`;
  }
  if (total >= 10) {
    return `${total}+`;
  }
  return HERO_STATS[0].value;
}

async function getHeroStats() {
  try {
    const { total } = await searchApis({ limit: 1 });
    return HERO_STATS.map((stat, index) =>
      index === 0 ? { ...stat, value: formatApiCount(total) } : stat,
    );
  } catch {
    return HERO_STATS;
  }
}

export async function HeroSection() {
  const stats = await getHeroStats();

  return (
    <section className="relative flex min-h-[calc(100svh-3.75rem)] flex-col overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)/0.15,transparent)]" />

      <div
        className={cn(
          landingShellClass,
          "relative flex flex-1 flex-col items-center justify-center py-10 text-center sm:py-12 lg:py-16",
        )}
      >
        <h1 className="hero-electric-title max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          <span className="hero-electric-segment">Find free APIs you can</span>{" "}
          <span className="hero-electric-segment hero-electric-segment--accent">
            trust, test,
          </span>{" "}
          <span className="hero-electric-segment">and ship faster.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
          {APP_DESCRIPTION} Browse curated docs, run live requests in your
          browser, and see security scores before you integrate.
        </p>

        <div className="mt-8 w-full max-w-xl">
          <HeroSearchForm placeholder={HERO_SEARCH_PLACEHOLDER} />
        </div>

        <div className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-12 w-full sm:w-auto">
            <Link href="/apis">
              Start exploring
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full sm:w-auto"
          >
            <Link href="/methodology">See how scoring works</Link>
          </Button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{HERO_MICRO_TRUST}</p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
          {stats.map((stat, index) => (
            <li key={stat.label} className="flex items-center gap-5">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="hidden text-muted-foreground sm:inline"
                >
                  •
                </span>
              ) : null}
              <div>
                <p className="font-display text-lg font-semibold tabular-nums sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-sm text-muted-foreground text-pretty">
          {HERO_TRUST_SUMMARY}{" "}
          <Link
            href="/methodology"
            className="font-medium text-primary hover:underline"
          >
            Learn how we score APIs
          </Link>
          .
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center motion-reduce:hidden">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronDown className="size-3.5 animate-bounce" aria-hidden />
          Scroll to explore
        </p>
      </div>
    </section>
  );
}
