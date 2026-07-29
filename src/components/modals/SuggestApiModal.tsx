"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ShieldCheck, FileCode, X, Construction } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";

interface SuggestApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestApiModal({ isOpen, onClose }: SuggestApiModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <Construction className="size-3.5" />
              <span>In Development</span>
            </div>

            {/* Content */}
            <div className="mt-4">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                <Sparkles className="size-5 text-primary" />
                Suggest an API
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our public API submission portal is currently under active development.
                Soon, you&apos;ll be able to submit free APIs to be automatically scanned and indexed.
              </p>

              {/* Upcoming features preview */}
              <div className="mt-5 space-y-2.5 rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium mb-1">
                  Upcoming Pipeline Features:
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span>Automatic TLS &amp; security posture scanning</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="size-4 text-primary shrink-0" />
                  <span>OpenAPI spec parsing &amp; live proxy testing</span>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose} className="w-full sm:w-auto">
                Got it
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
