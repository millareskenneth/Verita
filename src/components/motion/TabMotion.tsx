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
  /** Highlights actionable tabs (e.g. Try it now) with accent borders. */
  accent?: boolean;
}

export function AnimatedTabTrigger({
  value,
  activeTab,
  children,
  className,
  accent = false,
}: AnimatedTabTriggerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isActive = activeTab === value;

  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative z-0 h-auto min-h-10 shrink-0 px-4 py-2.5 text-sm font-semibold shadow-none transition-colors",
        "rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none",
        accent
          ? cn(
              "mb-0 rounded-lg border-2 border-emerald-500/35 text-emerald-700 hover:border-emerald-500/55 dark:text-emerald-400",
              isActive &&
                "border-emerald-500 bg-emerald-500/10 text-emerald-800 data-[state=active]:text-emerald-800 dark:text-emerald-300 dark:data-[state=active]:text-emerald-300",
            )
          : cn(
              "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
              isActive &&
                "text-foreground data-[state=active]:text-foreground",
            ),
        className,
      )}
    >
      {isActive && !prefersReducedMotion && !accent ? (
        <motion.span
          layoutId="api-detail-tab-underline"
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          aria-hidden
        />
      ) : isActive && !accent ? (
        <span
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
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
