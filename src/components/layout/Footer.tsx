import Link from "next/link";
import { APP_NAME } from "@/lib/constants/config";
import { FOOTER_DISCLAIMER, FOOTER_LEGAL_LINKS } from "@/lib/constants/legal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{APP_NAME}</p>
            <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              {FOOTER_DISCLAIMER}
            </p>
          </div>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="text-sm text-zinc-500">© {year} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
