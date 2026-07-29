import type { ApiCatalogEntry } from "@/types/api";

function buildDefaultPath(api: ApiCatalogEntry): string {
  return api.endpoints[0]?.path ?? "/";
}

function buildDefaultQuery(api: ApiCatalogEntry): string {
  const endpoint = api.endpoints[0];
  if (!endpoint?.parameters?.length) return "";

  return endpoint.parameters
    .filter((param) => param.in === "query" && param.example)
    .map((param) => `${param.name}=${param.example}`)
    .join("&");
}

function buildPathExample(api: ApiCatalogEntry): string {
  const endpoint = api.endpoints[0];
  const pathParam = endpoint?.parameters?.find((param) => param.in === "path");
  if (!endpoint || !pathParam?.example) return buildDefaultPath(api);

  return endpoint.path.replace(`{${pathParam.name}}`, pathParam.example);
}

export function buildDefaultRequestUrl(api: ApiCatalogEntry): string {
  const path = buildPathExample(api);
  const query = buildDefaultQuery(api);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = `${api.baseUrl}${normalizedPath.split("?")[0]}`;
  return query.trim() ? `${base}?${query.trim()}` : base;
}

export { buildDefaultQuery, buildPathExample };
