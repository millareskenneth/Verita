"use client";

import type { ReactNode } from "react";

interface HeroFeaturesScrollTransitionProps {
  hero: ReactNode;
  features: ReactNode;
}

export function HeroFeaturesScrollTransition({
  hero,
  features,
}: HeroFeaturesScrollTransitionProps) {
  return (
    <div className="relative flex flex-col">
      <div className="relative z-10">{hero}</div>
      <div className="relative z-20 bg-background">{features}</div>
    </div>
  );
}
