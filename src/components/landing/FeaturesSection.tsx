"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { landingShellClass } from "@/components/landing/landing-shell";
import { StaggerItem, StaggerReveal } from "@/components/motion/Reveal";

const WHY_VERITA_ITEMS = [
  {
    number: "01",
    title: "Curated discovery",
    description:
      "Every API is vetted for free-tier availability, open licensing, and real documentation — not scraped junk.",
  },
  {
    number: "02",
    title: "Test before you integrate",
    description:
      "Send live requests right in the browser with our built-in tester and safe proxy.",
  },
  {
    number: "03",
    title: "Trust before you ship",
    description:
      "Security scans, dependency checks, and doc completeness roll up into an advisory trust score on every API page.",
  },
] as const;

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / WHY_VERITA_ITEMS.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), WHY_VERITA_ITEMS.length - 1));
  }, []);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / WHY_VERITA_ITEMS.length;
    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0"
        >
          <StaggerReveal className="contents">
            {WHY_VERITA_ITEMS.map((item) => (
              <StaggerItem
                key={item.number}
                className="w-[78%] shrink-0 snap-start md:w-auto md:shrink md:snap-none"
              >
                <div className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md dark:bg-card/30">
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
        </div>

        {/* Pagination dots for Mobile carousel */}
        <div className="mt-4 flex justify-center items-center gap-2 md:hidden">
          {WHY_VERITA_ITEMS.map((item, idx) => (
            <button
              key={item.number}
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
