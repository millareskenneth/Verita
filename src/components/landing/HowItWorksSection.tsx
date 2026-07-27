import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";
import { ArrowRight, Search, Shield, Zap } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    description:
      "Search the catalog by category, tag, or use case. Filter by trust score, license, and free-status.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Test",
    description:
      "Open any API page and fire a live request. Inspect the response, latency, and generated code snippets.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Ship with confidence",
    description:
      "Review trust scores, security findings, and licensing before you wire the API into your app.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className={landingShellClass + " py-20"}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              From discovery to integration in three steps
            </h2>
          </div>
          <Link
            href="/apis"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Explore the catalog
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ol className="mt-14 grid gap-8 lg:grid-cols-3">
          {STEPS.map((item, index) => (
            <li key={item.step} className="relative">
              {index < STEPS.length - 1 ? (
                <div className="absolute top-8 left-[calc(100%-1rem)] hidden h-px w-[calc(100%-4rem)] bg-border lg:block" />
              ) : null}
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground">
                    {item.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
