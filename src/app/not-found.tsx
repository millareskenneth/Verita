import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        The page you requested does not exist or may have been removed from the
        catalog.
      </p>
      <div className="mt-6">
        <Button href="/">Back to home</Button>
      </div>
      <Link
        href="/apis"
        className="mt-4 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        Browse the API catalog
      </Link>
    </div>
  );
}
