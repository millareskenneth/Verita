import Link from "next/link";

import { APP_NAME } from "@/lib/constants/config";
import { FOOTER_LEGAL_LINKS } from "@/lib/constants/legal";
import { cn } from "@/lib/utils";

const footerLinkClass = cn(
  "font-medium text-foreground underline-offset-4 transition-colors",
  "hover:text-primary hover:underline",
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
          <p className="text-muted-foreground">
            © {year} {APP_NAME}. All rights reserved.
          </p>

          <span
            aria-hidden
            className="mx-2.5 text-muted-foreground/50 select-none sm:mx-3"
          >
            ·
          </span>

          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center">
            {FOOTER_LEGAL_LINKS.map((link, index) => (
              <span key={link.href} className="flex items-center">
                {index > 0 ? (
                  <span
                    aria-hidden
                    className="mx-2.5 text-muted-foreground/50 select-none sm:mx-3"
                  >
                    ·
                  </span>
                ) : null}
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
