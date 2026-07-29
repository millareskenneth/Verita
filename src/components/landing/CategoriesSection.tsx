"use client";

import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";
import {
  Bot,
  CloudSun,
  Coins,
  Gamepad2,
  MapPin,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { HoverLift, Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";
import { API_CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  weather: CloudSun,
  finance: Coins,
  "ai-ml": Bot,
  geolocation: MapPin,
  entertainment: Gamepad2,
  utilities: Wrench,
};

export function CategoriesSection() {
  return (
    <section className="border-t border-border bg-muted/20">
      <div className={landingShellClass + " py-20"}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browse
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Explore by category
          </h2>
          <p className="mt-4 text-muted-foreground">
            Jump into a category to find APIs for your next project.
          </p>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {API_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Wrench;

            return (
              <StaggerItem key={category.slug}>
                <HoverLift>
                  <Link
                    href={`/categories/${category.slug}`}
                    className={cn(
                      "group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5",
                      "transition-colors hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
                    )}
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        View {category.label.toLowerCase()} APIs
                      </p>
                    </div>
                  </Link>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerReveal>

        <Reveal className="mt-8 text-center" delay={0.1}>
          <Link
            href="/apis"
            className="text-sm font-medium text-primary hover:underline"
          >
            Or browse the full catalog →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
