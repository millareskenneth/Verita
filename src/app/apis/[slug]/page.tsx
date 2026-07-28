import { notFound } from "next/navigation";
import { ApiDocumentation } from "@/components/api-detail/ApiDocumentation";
import { apiPageShellClass } from "@/lib/layout/site-shell";
import { RecommendationBanner } from "@/components/api-detail/RecommendationBanner";
import { SecurityScoreBadge } from "@/components/api-detail/SecurityScoreBadge";
import { TrustScoreBreakdownPanel } from "@/components/api-detail/TrustScoreBreakdown";
import { TrustScoreDisclaimer } from "@/components/api-detail/TrustScoreDisclaimer";
import { ApiTester } from "@/components/tester/ApiTester";
import { getApiBySlug, getTrustScore } from "@/lib/api/client";

interface ApiDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const api = await getApiBySlug(slug);

  return {
    title: api?.name ?? "API not found",
    description: api?.description,
  };
}

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const [api, trustScore] = await Promise.all([
    getApiBySlug(slug),
    getTrustScore(slug),
  ]);

  if (!api) {
    notFound();
  }

  return (
    <div className={apiPageShellClass}>
      <RecommendationBanner api={api} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {api.category}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {api.name}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {api.description}
          </p>
        </div>
        <SecurityScoreBadge
          score={trustScore?.overall ?? api.trustScore}
          trustLabel={trustScore?.trustLabel}
          inline
        />
      </div>

      <div className="mb-4">
        <TrustScoreDisclaimer />
      </div>

      {/* Independent columns — each stack grows with its own content, no shared row heights */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <ApiDocumentation api={api} />
          {trustScore ? <TrustScoreBreakdownPanel breakdown={trustScore} /> : null}
        </div>

        <aside className="min-w-0 xl:w-[min(100%,26rem)] xl:shrink-0">
          <div className="xl:sticky xl:top-[4.5rem]">
            <ApiTester api={api} />
          </div>
        </aside>
      </div>
    </div>
  );
}
