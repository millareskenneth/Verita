"use client";

import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

interface FeaturedApisMotionProps {
  children: ReactNode;
}

export function FeaturedApisMotion({ children }: FeaturedApisMotionProps) {
  return <Reveal>{children}</Reveal>;
}
