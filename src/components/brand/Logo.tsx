import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants/config";
import { cn } from "@/lib/utils";

const LOGO_SIZES = {
  sm: 28,
  md: 32,
  lg: 40,
} as const;

interface LogoProps {
  showWordmark?: boolean;
  size?: keyof typeof LOGO_SIZES;
  className?: string;
  href?: string | null;
}

export function Logo({
  showWordmark = true,
  size = "md",
  className,
  href = "/",
}: LogoProps) {
  const dimension = LOGO_SIZES[size];

  const mark = (
    <Image
      src="/logo.svg"
      alt={showWordmark ? "" : APP_NAME}
      width={dimension}
      height={dimension}
      className="shrink-0"
      aria-hidden={showWordmark || undefined}
      unoptimized
    />
  );

  const content = (
    <>
      {mark}
      {showWordmark ? (
        <span className="font-display text-lg font-semibold tracking-tight">
          {APP_NAME}
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
