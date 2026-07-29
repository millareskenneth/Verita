import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ApiGrid } from "@/components/catalog/ApiGrid";
import { FeaturedApisMotion } from "@/components/landing/FeaturedApisMotion";
import { searchApis } from "@/lib/api/client";

export async function FeaturedApisSection() {
  const featured = await searchApis({ sort: "popularity", limit: 3 });

  return (
    <FeaturedApisMotion>
      <section className={landingShellClass + " py-20"}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Popular right now
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Featured APIs
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Top picks from the catalog — each with docs, a live tester, and a
              trust score you can inspect before integrating.
            </p>
          </div>
          <Link
            href="/apis"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all APIs
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10">
          <ApiGrid items={featured.items} />
        </div>
      </section>
    </FeaturedApisMotion>
  );
}
