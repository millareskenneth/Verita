"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface HeroFeaturesScrollTransitionProps {
  hero: ReactNode;
  features: ReactNode;
}

export function HeroFeaturesScrollTransition({
  hero,
  features,
}: HeroFeaturesScrollTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const container = containerRef.current;
    const heroEl = heroRef.current;
    const featuresEl = featuresRef.current;

    if (!container || !heroEl || !featuresEl) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(featuresEl, { opacity: 0, y: 56 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=115%",
            scrub: 0.85,
            pin: heroEl,
            anticipatePin: 1,
          },
        })
        .to(
          heroEl,
          {
            opacity: 0,
            scale: 0.97,
            y: -20,
            ease: "none",
          },
          0,
        )
        .to(
          featuresEl,
          {
            opacity: 1,
            y: 0,
            ease: "none",
          },
          0,
        );
    }, container);

    return () => context.revert();
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <>
        {hero}
        {features}
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div ref={heroRef} className="relative z-10">
        {hero}
      </div>
      <div
        ref={featuresRef}
        className="relative z-20 -mt-[18vh] rounded-t-3xl border-t border-border bg-background pt-6 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.35)]"
      >
        {features}
      </div>
    </div>
  );
}
