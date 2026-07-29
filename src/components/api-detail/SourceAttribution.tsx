import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  getLicenseUrl,
  requiresLicenseVerification,
} from "@/lib/constants/licenses";
import type { ApiCatalogEntry } from "@/types/api";

interface SourceAttributionProps {
  api: ApiCatalogEntry;
}

function sourceLabel(sourceUrl: string): string {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
    if (hostname.includes("github.com")) {
      return "View on GitHub";
    }
    if (hostname.includes("gitlab.com")) {
      return "View on GitLab";
    }
    return "View source";
  } catch {
    return "View source";
  }
}

export function SourceAttribution({ api }: SourceAttributionProps) {
  const licenseUrl = getLicenseUrl(api.license);
  const verifyLicense = requiresLicenseVerification(api.license);

  return (
    <Card className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        License & source
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-zinc-500">License</p>
          {licenseUrl ? (
            <Link
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-base font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {api.license}
            </Link>
          ) : (
            <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {api.license}
            </p>
          )}
          {verifyLicense ? (
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
              Verify the upstream license before use. Verita has not confirmed SPDX
              compliance for this entry.
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Listed under an open-source license. Confirm attribution requirements
              with the upstream project.
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500">Official source</p>
          <Link
            href={api.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block break-all text-base font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            {sourceLabel(api.sourceUrl)}
          </Link>
          <p className="mt-2 break-all text-sm text-zinc-600 dark:text-zinc-400">
            {api.sourceUrl}
          </p>
        </div>
      </div>
    </Card>
  );
}
