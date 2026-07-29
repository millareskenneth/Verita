import type {
  ApiCatalogEntry,
  ApiSearchParams,
  ApiSearchResult,
  SortOption,
} from "@/types/api";
import type { TrustScoreBreakdown } from "@/types/security";
import { getTrustLabel } from "@/lib/constants/trust-score";

function withTrustLabel(api: ApiCatalogEntry): ApiCatalogEntry {
  if (api.trustLabel) return api;
  return { ...api, trustLabel: getTrustLabel(api.trustScore).trustLabel };
}

const MOCK_APIS: ApiCatalogEntry[] = [
  {
    id: "1",
    slug: "open-meteo",
    name: "Open-Meteo",
    description:
      "Free weather forecast API for non-commercial use with no API key required.",
    baseUrl: "https://api.open-meteo.com/v1",
    category: "weather",
    tags: ["weather", "forecast", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/open-meteo/open-meteo",
    freeStatus: "free",
    trustScore: 92,
    documentationCompleteness: 88,
    popularity: 980,
    lastUpdated: "2026-03-10",
    rateLimit: "10,000 requests/day (fair use)",
    endpoints: [
      {
        method: "GET",
        path: "/forecast",
        description: "Retrieve weather forecasts for a location.",
        parameters: [
          {
            name: "latitude",
            in: "query",
            required: true,
            example: "52.52",
          },
          {
            name: "longitude",
            in: "query",
            required: true,
            example: "13.41",
          },
          {
            name: "current",
            in: "query",
            example: "temperature_2m,wind_speed_10m",
          },
        ],
      },
    ],
    requestExample:
      "GET https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m",
    responseExample: JSON.stringify(
      {
        latitude: 52.52,
        longitude: 13.41,
        current: { temperature_2m: 12.4, wind_speed_10m: 8.1 },
      },
      null,
      2,
    ),
  },
  {
    id: "2",
    slug: "rest-countries",
    name: "REST Countries",
    description:
      "Get information about countries via a RESTful API including population, borders, and currencies.",
    baseUrl: "https://restcountries.com/v3.1",
    category: "geolocation",
    tags: ["countries", "geography", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://gitlab.com/restcountries/restcountries",
    freeStatus: "free",
    trustScore: 86,
    documentationCompleteness: 74,
    popularity: 760,
    lastUpdated: "2026-01-22",
    endpoints: [
      {
        method: "GET",
        path: "/name/{name}",
        description: "Search for countries by name.",
        parameters: [
          {
            name: "name",
            in: "path",
            required: true,
            example: "philippines",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "coin-gecko-demo",
    name: "CoinGecko Demo",
    description:
      "Cryptocurrency market data API with a free demo tier for prototyping.",
    baseUrl: "https://api.coingecko.com/api/v3",
    category: "finance",
    tags: ["crypto", "finance", "market-data"],
    license: "Other",
    authMethod: "api-key",
    sourceUrl: "https://www.coingecko.com/en/api",
    freeStatus: "free-tier",
    trustScore: 78,
    documentationCompleteness: 81,
    popularity: 640,
    lastUpdated: "2026-02-05",
    rateLimit: "Demo tier: 30 calls/minute",
    endpoints: [
      {
        method: "GET",
        path: "/simple/price",
        description: "Get the current price of coins.",
        parameters: [
          {
            name: "ids",
            in: "query",
            required: true,
            example: "bitcoin,ethereum",
          },
          {
            name: "vs_currencies",
            in: "query",
            required: true,
            example: "usd",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "pokeapi",
    name: "PokéAPI",
    description:
      "Open RESTful Pokémon database with species, moves, abilities, and more.",
    baseUrl: "https://pokeapi.co/api/v2",
    category: "entertainment",
    tags: ["games", "pokemon", "no-auth"],
    license: "BSD-3-Clause",
    authMethod: "none",
    sourceUrl: "https://github.com/PokeAPI/pokeapi",
    freeStatus: "free",
    trustScore: 90,
    documentationCompleteness: 85,
    popularity: 820,
    lastUpdated: "2025-12-18",
    endpoints: [
      {
        method: "GET",
        path: "/pokemon/{name}",
        description: "Get information about a Pokémon.",
        parameters: [
          {
            name: "name",
            in: "path",
            required: true,
            example: "pikachu",
          },
        ],
      },
    ],
  },
];

function sortApis(items: ApiCatalogEntry[], sort: SortOption = "popularity") {
  const sorted = [...items];

  switch (sort) {
    case "trust-score":
      return sorted.sort((a, b) => b.trustScore - a.trustScore);
    case "last-updated":
      return sorted.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    case "doc-completeness":
      return sorted.sort(
        (a, b) => b.documentationCompleteness - a.documentationCompleteness,
      );
    default:
      return sorted.sort((a, b) => b.popularity - a.popularity);
  }
}

export function searchMockApis(params: ApiSearchParams = {}): ApiSearchResult {
  const query = params.query?.trim().toLowerCase() ?? "";
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  let items = MOCK_APIS.filter((api) => {
    const matchesCategory = params.category
      ? api.category === params.category
      : true;

    const matchesQuery = query
      ? [api.name, api.description, api.category, ...api.tags].some((value) =>
          value.toLowerCase().includes(query),
        )
      : true;

    return matchesCategory && matchesQuery;
  });

  items = sortApis(items, params.sort);

  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    items: paginated.map(withTrustLabel),
    total: items.length,
    page,
    limit,
  };
}

export function getMockApiBySlug(slug: string): ApiCatalogEntry | null {
  const api = MOCK_APIS.find((item) => item.slug === slug);
  return api ? withTrustLabel(api) : null;
}

export function getMockTrustScore(slug: string): TrustScoreBreakdown | null {
  const api = getMockApiBySlug(slug);
  if (!api) return null;

  const trust = getTrustLabel(api.trustScore);

  return {
    overall: api.trustScore,
    riskLevel:
      trust.trustLabel === "High"
        ? "low"
        : trust.trustLabel === "Medium"
          ? "medium"
          : "high",
    trustLabel: trust.trustLabel,
    lastScannedAt: "2026-07-20T08:00:00.000Z",
    checks: [
      { id: "ssl", label: "SSL / HTTPS", status: "pass" },
      { id: "domain", label: "Domain reputation", status: "pass" },
      { id: "license", label: "License verification", status: "pass" },
      {
        id: "dependencies",
        label: "Dependency audit",
        status: trust.trustLabel === "High" ? "pass" : "warning",
        detail:
          trust.trustLabel === "High"
            ? "No known critical vulnerabilities"
            : "1 advisory found in upstream dependency",
      },
      { id: "behavior", label: "Behavioral test calls", status: "pass" },
    ],
  };
}

export { MOCK_APIS };
