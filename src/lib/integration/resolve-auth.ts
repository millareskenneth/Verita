import type { ApiCatalogEntry, ApiParameter } from "@/types/api";

export type AuthDelivery = "none" | "header" | "query" | "basic" | "oauth";

export interface ResolvedAuth {
  delivery: AuthDelivery;
  headerName?: string;
  queryParam?: ApiParameter;
  headerParam?: ApiParameter;
  /** True when auth is required but the exact header/query name is not in catalog data. */
  needsOfficialDocs: boolean;
}

const AUTH_HEADER_NAMES = new Set([
  "authorization",
  "x-api-key",
  "api-key",
  "apikey",
  "x-auth-token",
  "x-access-token",
  "token",
]);

const AUTH_QUERY_NAMES = new Set([
  "api_key",
  "apikey",
  "key",
  "access_token",
  "token",
  "app_id",
  "appid",
]);

function collectParameters(api: ApiCatalogEntry): ApiParameter[] {
  return api.endpoints.flatMap((endpoint) => endpoint.parameters ?? []);
}

function isAuthHeaderParam(param: ApiParameter): boolean {
  const normalized = param.name.toLowerCase().replace(/[-_]/g, "");
  return (
    param.in === "header" &&
    (AUTH_HEADER_NAMES.has(param.name.toLowerCase()) ||
      normalized.includes("apikey") ||
      normalized.includes("authtoken") ||
      normalized.includes("accesstoken"))
  );
}

function isAuthQueryParam(param: ApiParameter): boolean {
  const normalized = param.name.toLowerCase();
  return param.in === "query" && AUTH_QUERY_NAMES.has(normalized);
}

export function resolveAuth(api: ApiCatalogEntry): ResolvedAuth {
  if (api.authMethod === "none") {
    return { delivery: "none", needsOfficialDocs: false };
  }

  if (api.authMethod === "oauth") {
    return { delivery: "oauth", needsOfficialDocs: true };
  }

  if (api.authMethod === "basic") {
    return { delivery: "basic", needsOfficialDocs: false };
  }

  const parameters = collectParameters(api);
  const headerParam = parameters.find(isAuthHeaderParam);
  if (headerParam) {
    return {
      delivery: "header",
      headerName: headerParam.name,
      headerParam,
      needsOfficialDocs: false,
    };
  }

  const queryParam = parameters.find(isAuthQueryParam);
  if (queryParam) {
    return {
      delivery: "query",
      queryParam,
      needsOfficialDocs: false,
    };
  }

  return {
    delivery: "header",
    headerName: "Authorization",
    needsOfficialDocs: true,
  };
}
