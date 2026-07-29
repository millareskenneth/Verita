"use client";

import type { ReactNode } from "react";

import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

interface LandingMotionShellProps {
  children: ReactNode;
}

export function LandingMotionShell({ children }: LandingMotionShellProps) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
