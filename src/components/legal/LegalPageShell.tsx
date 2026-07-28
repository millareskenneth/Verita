import type { ReactNode } from "react";

interface LegalPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function LegalPageShell({ title, description, children }: LegalPageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{description}</p>
        <p className="mt-4 text-sm text-zinc-500">
          Last updated: July 27, 2026. This document is informational and not legal
          advice.
        </p>
      </header>
      <div className="space-y-10 text-zinc-700 dark:text-zinc-300">{children}</div>
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
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7">{children}</div>
    </section>
  );
}
