import type {
  ApiCatalogEntry,
  ApiSearchParams,
  ApiSearchResult,
  SortOption,
} from "@/types/api";
import type { TrustScoreBreakdown } from "@/types/security";

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
    sourceUrl: "https://docs.coingecko.com/",
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
  {
    id: "5",
    slug: "dog-ceo",
    name: "Dog CEO",
    description: "Random dog pictures by breed. No authentication required.",
    baseUrl: "https://dog.ceo/api",
    category: "entertainment",
    tags: ["dogs", "images", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://dog.ceo/dog-api/documentation/",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 72,
    popularity: 540,
    lastUpdated: "2026-02-14",
    endpoints: [
      {
        method: "GET",
        path: "/breeds/image/random",
        description: "Return a random dog image URL.",
      },
    ],
  },
  {
    id: "6",
    slug: "cat-facts",
    name: "Cat Facts",
    description: "Daily cat facts returned as plain text or JSON.",
    baseUrl: "https://catfact.ninja",
    category: "entertainment",
    tags: ["cats", "facts", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://catfact.ninja/",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 65,
    popularity: 480,
    lastUpdated: "2026-01-08",
    endpoints: [
      {
        method: "GET",
        path: "/fact",
        description: "Return a random cat fact.",
      },
    ],
  },
  {
    id: "7",
    slug: "random-user",
    name: "Random User Generator",
    description: "Generate random user profiles for prototyping and testing.",
    baseUrl: "https://randomuser.me/api",
    category: "utilities",
    tags: ["testing", "mock-data", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/RandomAPI/Randomuser.me-Node",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 78,
    popularity: 710,
    lastUpdated: "2026-02-20",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Generate random users.",
        parameters: [
          { name: "results", in: "query", example: "5" },
          { name: "nat", in: "query", example: "us,gb" },
        ],
      },
    ],
  },
  {
    id: "8",
    slug: "open-trivia-db",
    name: "Open Trivia Database",
    description: "Free multiple-choice trivia questions across many categories.",
    baseUrl: "https://opentdb.com",
    category: "entertainment",
    tags: ["trivia", "games", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://opentdb.com/",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 70,
    popularity: 620,
    lastUpdated: "2026-01-30",
    endpoints: [
      {
        method: "GET",
        path: "/api.php",
        description: "Fetch trivia questions.",
        parameters: [
          { name: "amount", in: "query", required: true, example: "10" },
          { name: "category", in: "query", example: "science" },
        ],
      },
    ],
  },
  {
    id: "9",
    slug: "rick-and-morty",
    name: "Rick and Morty API",
    description: "Character, location, and episode data from Rick and Morty.",
    baseUrl: "https://rickandmortyapi.com/api",
    category: "entertainment",
    tags: ["tv", "characters", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/afuh/rick-and-morty-api",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 82,
    popularity: 690,
    lastUpdated: "2026-02-11",
    endpoints: [
      {
        method: "GET",
        path: "/character/{id}",
        description: "Get a character by ID.",
        parameters: [
          { name: "id", in: "path", required: true, example: "1" },
        ],
      },
    ],
  },
  {
    id: "10",
    slug: "studio-ghibli",
    name: "Studio Ghibli API",
    description: "Resources about Studio Ghibli films, people, and locations.",
    baseUrl: "https://ghibliapi.vercel.app",
    category: "entertainment",
    tags: ["anime", "films", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://ghibliapi.vercel.app",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 76,
    popularity: 580,
    lastUpdated: "2026-01-18",
    endpoints: [
      {
        method: "GET",
        path: "/films",
        description: "List all Studio Ghibli films.",
      },
    ],
  },
  {
    id: "11",
    slug: "jokeapi",
    name: "JokeAPI",
    description: "Programming and general jokes with filtering by category and type.",
    baseUrl: "https://v2.jokeapi.dev",
    category: "entertainment",
    tags: ["jokes", "humor", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/Sv443/JokeAPI",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 80,
    popularity: 650,
    lastUpdated: "2026-03-01",
    endpoints: [
      {
        method: "GET",
        path: "/joke/{category}",
        description: "Fetch a random joke.",
        parameters: [
          { name: "category", in: "path", required: true, example: "Programming" },
        ],
      },
    ],
  },
  {
    id: "12",
    slug: "frankfurter",
    name: "Frankfurter",
    description: "Free exchange rates from the European Central Bank. No API key needed.",
    baseUrl: "https://api.frankfurter.app",
    category: "finance",
    tags: ["currency", "exchange-rates", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://frankfurter.dev",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 84,
    popularity: 590,
    lastUpdated: "2026-02-25",
    endpoints: [
      {
        method: "GET",
        path: "/latest",
        description: "Latest exchange rates.",
        parameters: [
          { name: "from", in: "query", example: "USD" },
          { name: "to", in: "query", example: "EUR,GBP" },
        ],
      },
    ],
  },
  {
    id: "13",
    slug: "jsonplaceholder",
    name: "JSONPlaceholder",
    description: "Fake REST API for testing and prototyping with posts, users, and todos.",
    baseUrl: "https://jsonplaceholder.typicode.com",
    category: "utilities",
    tags: ["testing", "mock-data", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/typicode/jsonplaceholder",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 90,
    popularity: 850,
    lastUpdated: "2026-02-08",
    endpoints: [
      {
        method: "GET",
        path: "/posts/{id}",
        description: "Get a blog post by ID.",
        parameters: [
          { name: "id", in: "path", required: true, example: "1" },
        ],
      },
    ],
  },
  {
    id: "14",
    slug: "agify",
    name: "Agify",
    description: "Predict age from a first name using demographic data.",
    baseUrl: "https://api.agify.io",
    category: "ai-ml",
    tags: ["names", "prediction", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://agify.io/documentation/api",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 68,
    popularity: 430,
    lastUpdated: "2026-01-12",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Predict age for a given name.",
        parameters: [
          { name: "name", in: "query", required: true, example: "michael" },
        ],
      },
    ],
  },
  {
    id: "15",
    slug: "genderize",
    name: "Genderize",
    description: "Predict gender from a first name using global name statistics.",
    baseUrl: "https://api.genderize.io",
    category: "ai-ml",
    tags: ["names", "prediction", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://genderize.io/documentation/api",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 68,
    popularity: 510,
    lastUpdated: "2026-01-12",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Predict gender for a given name.",
        parameters: [
          { name: "name", in: "query", required: true, example: "luc" },
        ],
      },
    ],
  },
  {
    id: "16",
    slug: "nationalize",
    name: "Nationalize",
    description: "Predict nationality from a first name using census data.",
    baseUrl: "https://api.nationalize.io",
    category: "geolocation",
    tags: ["names", "nationality", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://nationalize.io/documentation/api",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 68,
    popularity: 470,
    lastUpdated: "2026-01-12",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Predict nationality for a given name.",
        parameters: [
          { name: "name", in: "query", required: true, example: "nathaniel" },
        ],
      },
    ],
  },
  {
    id: "17",
    slug: "free-dictionary",
    name: "Free Dictionary API",
    description: "English word definitions, phonetics, and meanings.",
    baseUrl: "https://api.dictionaryapi.dev/api/v2/entries/en",
    category: "utilities",
    tags: ["dictionary", "language", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://github.com/meetDeveloper/freeDictionaryAPI",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 74,
    popularity: 560,
    lastUpdated: "2026-02-03",
    endpoints: [
      {
        method: "GET",
        path: "/{word}",
        description: "Look up a word.",
        parameters: [
          { name: "word", in: "path", required: true, example: "hello" },
        ],
      },
    ],
  },
  {
    id: "18",
    slug: "datamuse",
    name: "Datamuse",
    description: "Word-finding query engine for rhyme, meaning, and spelling.",
    baseUrl: "https://api.datamuse.com",
    category: "ai-ml",
    tags: ["words", "nlp", "no-auth"],
    license: "Other",
    authMethod: "none",
    sourceUrl: "https://www.datamuse.com/api/",
    freeStatus: "free",
    trustScore: 90,
    documentationCompleteness: 77,
    popularity: 520,
    lastUpdated: "2026-01-25",
    endpoints: [
      {
        method: "GET",
        path: "/words",
        description: "Find words matching a query.",
        parameters: [
          { name: "ml", in: "query", example: "spoon" },
          { name: "max", in: "query", example: "10" },
        ],
      },
    ],
  },
  {
    id: "19",
    slug: "themealdb",
    name: "TheMealDB",
    description: "Meal recipes, ingredients, and categories with a free test API key.",
    baseUrl: "https://www.themealdb.com/api/json/v1/1",
    category: "entertainment",
    tags: ["food", "recipes", "no-auth"],
    license: "Other",
    authMethod: "none",
    sourceUrl: "https://www.themealdb.com/api.php",
    freeStatus: "free",
    trustScore: 90,
    documentationCompleteness: 79,
    popularity: 610,
    lastUpdated: "2026-02-17",
    endpoints: [
      {
        method: "GET",
        path: "/search.php",
        description: "Search meals by name.",
        parameters: [
          { name: "s", in: "query", required: true, example: "Arrabiata" },
        ],
      },
    ],
  },
  {
    id: "20",
    slug: "open-library",
    name: "Open Library",
    description: "Open, editable library catalog with book search and metadata.",
    baseUrl: "https://openlibrary.org",
    category: "utilities",
    tags: ["books", "library", "no-auth"],
    license: "Apache-2.0",
    authMethod: "none",
    sourceUrl: "https://github.com/internetarchive/openlibrary",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 83,
    popularity: 670,
    lastUpdated: "2026-02-22",
    endpoints: [
      {
        method: "GET",
        path: "/search.json",
        description: "Search books by title or author.",
        parameters: [
          { name: "q", in: "query", required: true, example: "tolkien" },
        ],
      },
    ],
  },
  {
    id: "21",
    slug: "advice-slip",
    name: "Advice Slip",
    description: "Random advice slips returned as JSON.",
    baseUrl: "https://api.adviceslip.com",
    category: "entertainment",
    tags: ["advice", "quotes", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://adviceslip.com/",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 60,
    popularity: 390,
    lastUpdated: "2026-01-05",
    endpoints: [
      {
        method: "GET",
        path: "/advice",
        description: "Return a random advice slip.",
      },
    ],
  },
  {
    id: "22",
    slug: "chuck-norris",
    name: "Chuck Norris API",
    description: "Chuck Norris jokes in JSON format with category search.",
    baseUrl: "https://api.chucknorris.io/jokes",
    category: "entertainment",
    tags: ["jokes", "humor", "no-auth"],
    license: "MIT",
    authMethod: "none",
    sourceUrl: "https://api.chucknorris.io/",
    freeStatus: "free",
    trustScore: 100,
    documentationCompleteness: 66,
    popularity: 450,
    lastUpdated: "2026-01-20",
    endpoints: [
      {
        method: "GET",
        path: "/random",
        description: "Return a random Chuck Norris joke.",
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
      ? [api.name, api.description, ...api.tags].some((value) =>
          value.toLowerCase().includes(query),
        )
      : true;

    return matchesCategory && matchesQuery;
  });

  items = sortApis(items, params.sort);

  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    items: paginated,
    total: items.length,
    page,
    limit,
  };
}

export function getMockApiBySlug(slug: string): ApiCatalogEntry | null {
  return MOCK_APIS.find((api) => api.slug === slug) ?? null;
}

export function getMockTrustScore(slug: string): TrustScoreBreakdown | null {
  const api = getMockApiBySlug(slug);
  if (!api) return null;

  const testedAt = "2026-07-20T08:00:00.000Z";

  return {
    overall: api.trustScore,
    riskLevel: api.trustScore >= 85 ? "low" : api.trustScore >= 70 ? "medium" : "high",
    lastScannedAt: testedAt,
    checks: [
      {
        id: "ssl",
        label: "SSL / HTTPS",
        status: "unknown",
        detail: "Connect to the Verita backend for live TLS verification",
        evidence: {
          method: "TLS certificate handshake",
          testedAt,
          findings: ["Mock catalog data — live proof requires the security API"],
        },
      },
      {
        id: "host",
        label: "Hostname validation",
        status: "unknown",
        detail: "Connect to the Verita backend for live DNS verification",
        evidence: {
          method: "DNS hostname resolution",
          target: api.baseUrl,
          testedAt,
          findings: ["Mock catalog data — live proof requires the security API"],
        },
      },
      {
        id: "license",
        label: "License verification",
        status: "pass",
        detail: `${api.license} — approved open-source license`,
        evidence: {
          method: "Open-source license allowlist validation",
          target: api.license,
          testedAt,
          findings: [`License recorded as ${api.license} in catalog metadata`],
        },
      },
      {
        id: "dependencies",
        label: "Dependency audit",
        status: "unknown",
        detail: "Requires a full repository scan with OSV scanner",
        evidence: {
          method: "OSV dependency vulnerability scan",
          testedAt,
          findings: [
            "Backend unavailable — start the API at localhost:8000 for live security results",
          ],
        },
      },
      {
        id: "behavior",
        label: "Behavioral test calls",
        status: "unknown",
        detail: "Requires a sandboxed live request against the API endpoint",
        evidence: {
          method: "Sandboxed GET request to live endpoint",
          target: api.baseUrl,
          testedAt,
          findings: [
            "Backend unavailable — start the API at localhost:8000 for live behavioral test proof",
          ],
        },
      },
    ],
  };
}

export { MOCK_APIS };
