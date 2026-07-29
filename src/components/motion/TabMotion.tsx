"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { TabsTrigger } from "@/components/ui/shadcn/tabs";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const tabEase = [0.22, 1, 0.36, 1] as const;

interface AnimatedTabTriggerProps {
  value: string;
  activeTab: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedTabTrigger({
  value,
  activeTab,
  children,
  className,
}: AnimatedTabTriggerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isActive = activeTab === value;

  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative z-0 bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
        className,
      )}
    >
      {isActive && !prefersReducedMotion ? (
        <motion.span
          layoutId="api-detail-tab-indicator"
          className="absolute inset-0 rounded-md bg-background shadow-sm"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          aria-hidden
        />
      ) : isActive ? (
        <span
          className="absolute inset-0 rounded-md bg-background shadow-sm"
          aria-hidden
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </TabsTrigger>
  );
}

interface TabPanelMotionProps {
  tabKey: string;
  children: ReactNode;
  className?: string;
}

export function TabPanelMotion({
  tabKey,
  children,
  className,
}: TabPanelMotionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: tabEase }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface CollapseMotionProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapseMotion({ open, children, className }: CollapseMotionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return open ? <div className={className}>{children}</div> : null;
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: tabEase }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
