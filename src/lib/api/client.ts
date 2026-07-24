import { API_BASE_URL } from "@/lib/constants/config";
import type {
  ApiCatalogEntry,
  ApiSearchParams,
  ApiSearchResult,
} from "@/types/api";
import type { TrustScoreBreakdown } from "@/types/security";
import {
  getMockApiBySlug,
  getMockTrustScore,
  searchMockApis,
} from "@/data/mock-apis";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchApis(
  params: ApiSearchParams = {},
): Promise<ApiSearchResult> {
  try {
    const query = new URLSearchParams();

    if (params.query) query.set("q", params.query);
    if (params.category) query.set("category", params.category);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return await fetchJson<ApiSearchResult>(`/api/catalog${suffix}`);
  } catch {
    return searchMockApis(params);
  }
}

export async function getApiBySlug(slug: string): Promise<ApiCatalogEntry | null> {
  try {
    return await fetchJson<ApiCatalogEntry>(`/api/catalog/${slug}`);
  } catch {
    return getMockApiBySlug(slug);
  }
}

export async function getTrustScore(
  slug: string,
): Promise<TrustScoreBreakdown | null> {
  try {
    return await fetchJson<TrustScoreBreakdown>(`/api/catalog/${slug}/security`);
  } catch {
    return getMockTrustScore(slug);
  }
}
