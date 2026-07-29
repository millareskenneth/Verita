"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface UseAutoScrollCarouselOptions {
  itemCount: number;
  intervalMs?: number;
}

export function useAutoScrollCarousel({
  itemCount,
  intervalMs = 4500,
}: UseAutoScrollCarouselOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / itemCount;
    if (cardWidth <= 0) return;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), itemCount - 1));
  }, [itemCount]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / itemCount;
      el.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    },
    [itemCount],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onPause = () => setIsPaused(true);
    const onResume = () => setIsPaused(false);

    el.addEventListener("mouseenter", onPause);
    el.addEventListener("mouseleave", onResume);
    el.addEventListener("touchstart", onPause, { passive: true });
    el.addEventListener("touchend", onResume, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onPause);
      el.removeEventListener("mouseleave", onResume);
      el.removeEventListener("touchstart", onPause);
      el.removeEventListener("touchend", onResume);
    };
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || itemCount <= 1) return;

    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (window.innerWidth >= 768) return;

      const nextIndex = (activeIndex + 1) % itemCount;
      scrollToIndex(nextIndex);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, itemCount, intervalMs, prefersReducedMotion, scrollToIndex]);

  return {
    scrollRef,
    activeIndex,
    scrollToIndex,
  };
}
