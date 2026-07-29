"use client";

import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";
import { ArrowRight, Search, Shield, Zap } from "lucide-react";

import {
  Reveal,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/Reveal";

const STEPS = [
  {
    step: 1,
    icon: Search,
    title: "Discover",
    description:
      "Search the catalog by category, tag, or use case. Filter by trust score, license, and free status.",
  },
  {
    step: 2,
    icon: Zap,
    title: "Test",
    description:
      "Open any API page and fire a live request. Inspect the response, latency, and generated code snippets.",
  },
  {
    step: 3,
    icon: Shield,
    title: "Ship with confidence",
    description:
      "Review trust scores, security findings, and licensing before you wire the API into your app.",
  },
] as const;

export function HowItWorksSection() {
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
          <div
            aria-hidden
            className="pointer-events-none absolute top-7 right-[16.666%] left-[16.666%] hidden h-px bg-linear-to-r from-transparent via-primary/30 to-transparent lg:block"
          />

          <StaggerReveal className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((item) => (
              <StaggerItem key={item.step}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                      <item.icon className="size-6 text-primary" strokeWidth={1.75} />
                    </div>
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-[16rem] text-sm leading-6 text-muted-foreground text-pretty sm:max-w-[18rem]">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
