import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/shadcn/button";

export function CtaSection() {
  return (
    <section className={landingShellClass + " py-20"}>
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)/0.12,transparent_50%)]" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Know a great free API?
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Help grow the catalog. Submit an API for review and we will document
            it, scan it, and make it testable for the community.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/submit">
                <Plus className="size-4" />
                Suggest an API
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/apis">
                Browse catalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
