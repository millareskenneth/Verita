import {
  FlaskConical,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { landingShellClass } from "@/components/landing/landing-shell";
import {
  HoverLift,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/Reveal";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated discovery",
    description:
      "Every API is vetted for free-tier availability, open licensing, and real documentation — not scraped junk.",
  },
  {
    icon: FlaskConical,
    title: "Test before you integrate",
    description:
      "Send live requests from your browser with our built-in tester. CORS blocked? We route through a safe proxy.",
  },
  {
    icon: ShieldCheck,
    title: "Trust scores",
    description:
      "Security scans, dependency checks, and doc completeness roll up into an advisory trust score on every API page.",
  },
  {
    icon: Radar,
    title: "Stay current",
    description:
      "We monitor free-status changes, auth requirements, and pricing drift so you are not surprised in production.",
  },
] as const;

export function FeaturesSection() {
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

      <StaggerReveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <StaggerItem key={feature.title}>
            <HoverLift>
              <Card className="h-full border-border/60 bg-card/50 py-0 shadow-none transition-colors hover:border-primary/30 hover:bg-card">
                <CardHeader className="px-5 pt-5">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
