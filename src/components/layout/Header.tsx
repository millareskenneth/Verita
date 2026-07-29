"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { SuggestApiModal } from "@/components/modals/SuggestApiModal";
import { Button } from "@/components/ui/shadcn/button";

export function Header() {
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-lg">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />

          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/apis" className="gap-2">
                <LayoutGrid className="size-4" />
                <span className="hidden sm:inline">Browse APIs</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSuggestModalOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Suggest API</span>
            </Button>
          </nav>
        </div>
      </header>

      <SuggestApiModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
    </>
  );
}
