"use client";

import { landingShellClass } from "@/components/landing/landing-shell";
import { StaggerItem, StaggerReveal } from "@/components/motion/Reveal";
import { useAutoScrollCarousel } from "@/hooks/useAutoScrollCarousel";

const WHY_VERITA_ITEMS = [
  {
    id: "curated-discovery",
    title: "Curated discovery",
    description:
      "Every API is vetted for free-tier availability, open licensing, and real documentation — not scraped junk.",
  },
  {
    id: "test-before-integrate",
    title: "Test before you integrate",
    description:
      "Send live requests right in the browser with our built-in tester and safe proxy.",
  },
  {
    id: "trust-before-ship",
    title: "Trust before you ship",
    description:
      "Security scans, dependency checks, and doc completeness roll up into an advisory trust score on every API page.",
  },
] as const;

export function FeaturesSection() {
  const { scrollRef, activeIndex, scrollToIndex } = useAutoScrollCarousel({
    itemCount: WHY_VERITA_ITEMS.length,
    intervalMs: 4500,
  });

  return (
    <section className={landingShellClass + " pb-20 pt-4"}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Why Verita
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to evaluate an API — in one place
        </h2>
        <p className="mt-4 text-muted-foreground text-pretty">
          Stop juggling docs tabs, Postman collections, and random GitHub repos.
          Verita is the hub for finding and validating free APIs.
        </p>
      </div>

      <div className="relative mt-14">
        {/* Mobile horizontal scroll-snap carousel / Desktop 3-column grid */}
        <StaggerReveal
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0"
        >
          {WHY_VERITA_ITEMS.map((item) => (
            <StaggerItem
              key={item.id}
              className="w-[78%] shrink-0 snap-start md:w-auto md:shrink md:snap-none"
            >
              <div className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md dark:bg-card/30">
                {/* Thin horizontal accent line: 28px x 3px, rounded 2px, 16px bottom margin */}
                <div className="mb-4 h-[3px] w-[28px] rounded-[2px] bg-primary" />
                <h3 className="text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground text-pretty">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* Pagination dots for Mobile carousel */}
        <div className="mt-4 flex justify-center items-center gap-2 md:hidden">
          {WHY_VERITA_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
