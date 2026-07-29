"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { landingShellClass } from "@/components/landing/landing-shell";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";
import { useAutoScrollCarousel } from "@/hooks/useAutoScrollCarousel";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "Search the catalog by category, tag, or use case. Filter by trust score, license, and free status.",
  },
  {
    number: "02",
    title: "Test",
    description:
      "Open any API page and fire a live request. Inspect the response, latency, and generated code snippets.",
  },
  {
    number: "03",
    title: "Ship with confidence",
    description:
      "Review trust scores, security findings, and licensing before you wire the API into your app.",
  },
] as const;

export function HowItWorksSection() {
  const { scrollRef, activeIndex, scrollToIndex } = useAutoScrollCarousel({
    itemCount: STEPS.length,
    intervalMs: 4500,
  });

  return (
    <section className="border-y border-border bg-muted/30">
      <div className={`${landingShellClass} py-20`}>
        <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              From discovery to integration in three steps
            </h2>
          </div>
          <Link
            href="/apis"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Explore the catalog
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <div className="relative mt-16">
          {/* Horizontal connector line on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-8 left-[16.666%] right-[16.666%] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block z-0"
          />

          {/* Mobile horizontal scroll-snap carousel / Desktop 3-column grid */}
          <StaggerReveal
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0"
          >
            {STEPS.map((item) => (
              <StaggerItem
                key={item.number}
                className="w-[78%] shrink-0 snap-start md:w-auto md:shrink md:snap-none"
              >
                <div className="group relative z-10 flex h-full flex-col rounded-2xl border border-border/60 bg-card/60 p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md dark:bg-card/40">
                  <span className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    {item.number}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          {/* Pagination dots for Mobile carousel */}
          <div className="mt-4 flex justify-center items-center gap-2 md:hidden">
            {STEPS.map((item, idx) => (
              <button
                key={item.number}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
