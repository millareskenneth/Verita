import { landingShellClass } from "@/lib/layout/site-shell";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/shadcn/button";

const NAV_LINKS = [
  { href: "/apis", label: "Browse APIs", icon: LayoutGrid },
  { href: "/submit", label: "Suggest API", icon: Plus },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-lg">
      <div className={`${landingShellClass} flex items-center justify-between gap-6 py-3`}>
        <Logo />

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href} className="gap-2">
                <link.icon className="size-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
