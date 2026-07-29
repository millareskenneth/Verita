import type { ApiCatalogEntry, ApiEndpoint } from "@/types/api";

function substitutePathParams(path: string, parameters: ApiEndpoint["parameters"]): string {
  let resolved = path;
  for (const param of parameters ?? []) {
    if (param.in === "path" && param.example) {
      resolved = resolved.replace(`{${param.name}}`, param.example);
    }
  }
  return resolved;
}

function buildQueryString(parameters: ApiEndpoint["parameters"]): string {
  return (parameters ?? [])
    .filter((param) => param.in === "query" && param.example)
    .map(
      (param) =>
        `${encodeURIComponent(param.name)}=${encodeURIComponent(param.example ?? "")}`,
    )
    .join("&");
}

export function buildEndpointRequestUrl(
  api: ApiCatalogEntry,
  endpoint: ApiEndpoint,
): string {
  const path = substitutePathParams(endpoint.path, endpoint.parameters);
  const query = buildQueryString(endpoint.parameters);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = `${api.baseUrl}${normalizedPath.split("?")[0]}`;
  return query ? `${base}?${query}` : base;
}

export function buildRequestLine(
  api: ApiCatalogEntry,
  endpoint: ApiEndpoint,
): string {
  return `${endpoint.method} ${buildEndpointRequestUrl(api, endpoint)}`;
}
