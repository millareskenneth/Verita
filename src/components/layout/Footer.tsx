import { APP_NAME } from "@/lib/constants/config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{APP_NAME}</p>
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Trust scores are advisory and do not guarantee safety. Always review
            upstream terms before production use.
          </p>
        </div>
        <p className="text-sm text-zinc-500">
          MVP scaffold · Phase 1 curated catalog
        </p>
      </div>
    </footer>
  );
}
