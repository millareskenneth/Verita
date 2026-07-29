import type { ReactNode } from "react";

interface MethodologyPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function MethodologyPageShell({
  title,
  description,
  children,
}: MethodologyPageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </header>
      <div className="space-y-10 text-foreground/90">{children}</div>
    </div>
  );
}

interface MethodologySectionProps {
  id?: string;
  title?: string;
  children: ReactNode;
}

export function MethodologySection({ id, title, children }: MethodologySectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      {title ? (
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      ) : null}
      <div className={title ? "mt-4 space-y-4 text-sm leading-7" : "space-y-4 text-sm leading-7"}>
        {children}
      </div>
    </section>
  );
}
