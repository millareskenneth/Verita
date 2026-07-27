import { landingShellClass } from "@/components/landing/landing-shell";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Separator } from "@/components/ui/shadcn/separator";
import { APP_NAME } from "@/lib/constants/config";
import { FOOTER_DISCLAIMER, FOOTER_LEGAL_LINKS } from "@/lib/constants/legal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className={`${landingShellClass} py-10`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Logo href={null} size="sm" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {FOOTER_DISCLAIMER}
            </p>
          </div>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
