import type { ReactNode } from "react";

interface LegalPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function LegalPageShell({ title, description, children }: LegalPageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <p className="mt-4 text-sm text-muted-foreground/80">
          Last updated: July 27, 2026. This document is informational and not legal
          advice.
        </p>
      </header>
      <div className="space-y-10 text-foreground/90">{children}</div>
    </div>
  );
}

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-foreground/85">
        {children}
      </div>
    </section>
  );
}
