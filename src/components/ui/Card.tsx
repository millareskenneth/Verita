interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
