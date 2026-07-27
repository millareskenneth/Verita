import { notFound } from "next/navigation";
import { ApiDocumentation } from "@/components/api-detail/ApiDocumentation";
import { RecommendationBanner } from "@/components/api-detail/RecommendationBanner";
import { SecurityScoreBadge } from "@/components/api-detail/SecurityScoreBadge";
import { TrustScoreBreakdownPanel } from "@/components/api-detail/TrustScoreBreakdown";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <RecommendationBanner api={api} />

      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {api.category}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{api.name}</h1>
          <p className="mt-3 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
            {api.description}
          </p>
        </div>
        <div className="w-full max-w-xs">
          <SecurityScoreBadge score={api.trustScore} />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ApiDocumentation api={api} />
        <div className="space-y-8">
          <ApiTester api={api} />
          {trustScore ? <TrustScoreBreakdownPanel breakdown={trustScore} /> : null}
        </div>
      </div>
    </div>
  );
}
