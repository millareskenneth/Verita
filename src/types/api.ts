export type LicenseType =
  | "MIT"
  | "Apache-2.0"
  | "GPL-3.0"
  | "BSD-3-Clause"
  | "Other";

export type AuthMethod = "none" | "api-key" | "oauth" | "basic";

export type FreeStatus = "free" | "free-tier" | "under-review" | "delisted";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type SortOption =
  | "popularity"
  | "trust-score"
  | "last-updated"
  | "doc-completeness";

export interface ApiParameter {
  name: string;
  in: "query" | "header" | "path" | "body";
  required?: boolean;
  description?: string;
  example?: string;
}

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: ApiParameter[];
}

export interface ApiCatalogEntry {
  id: string;
  slug: string;
  name: string;
  description: string;
  baseUrl: string;
  category: string;
  tags: string[];
  license: LicenseType;
  authMethod: AuthMethod;
  sourceUrl: string;
  freeStatus: FreeStatus;
  trustScore: number;
  documentationCompleteness: number;
  popularity: number;
  lastUpdated: string;
  endpoints: ApiEndpoint[];
  rateLimit?: string;
  requestExample?: string;
  responseExample?: string;
}

export interface ApiSearchParams {
  query?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface ApiSearchResult {
  items: ApiCatalogEntry[];
  total: number;
  page: number;
  limit: number;
}
