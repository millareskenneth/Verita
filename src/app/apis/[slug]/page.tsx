import { notFound } from "next/navigation";

import { ApiDetailContent } from "@/components/api-detail/ApiDetailContent";
import { RecommendationBanner } from "@/components/api-detail/RecommendationBanner";
import { getApiBySlug, getTrustScore } from "@/lib/api/client";
import { apiPageShellClass } from "@/lib/layout/site-shell";

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
      <ApiDetailContent api={api} trustScore={trustScore} />
    </div>
  );
}
