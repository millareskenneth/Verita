import type { ApiCatalogEntry, ApiEndpoint } from "@/types/api";

import { buildEndpointRequestUrl } from "@/lib/integration/build-endpoint-url";
import { resolveAuth } from "@/lib/integration/resolve-auth";

export type SnippetLanguage = "curl" | "javascript" | "python";

export interface EndpointSnippets {
  curl: string;
  javascript: string;
  python: string;
}

function escapeDoubleQuotes(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildAuthCurlFlags(api: ApiCatalogEntry): string[] {
  const auth = resolveAuth(api);
  if (auth.delivery === "none") return [];

  if (auth.delivery === "basic") {
    return ['  -u "YOUR_USERNAME:YOUR_PASSWORD"'];
  }

  if (auth.delivery === "oauth") {
    return ['  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"'];
  }

  if (auth.delivery === "query" && auth.queryParam) {
    return [];
  }

  const headerName = auth.headerName ?? "Authorization";
  if (headerName.toLowerCase() === "authorization") {
    return ['  -H "Authorization: Bearer YOUR_API_KEY"'];
  }

  return [`  -H "${headerName}: YOUR_API_KEY"`];
}

function buildAuthJsHeaders(api: ApiCatalogEntry): string {
  const auth = resolveAuth(api);
  if (auth.delivery === "none") {
    return `    Accept: "application/json",`;
  }

  if (auth.delivery === "basic") {
    return `    Authorization: "Basic " + btoa("YOUR_USERNAME:YOUR_PASSWORD"),
    Accept: "application/json",`;
  }

  if (auth.delivery === "oauth") {
    return `    Authorization: \`Bearer \${process.env.${api.slug.toUpperCase().replace(/-/g, "_")}_TOKEN}\`,
    Accept: "application/json",`;
  }

  if (auth.delivery === "query") {
    return `    Accept: "application/json",`;
  }

  const headerName = auth.headerName ?? "Authorization";
  if (headerName.toLowerCase() === "authorization") {
    return `    Authorization: \`Bearer \${process.env.${api.slug.toUpperCase().replace(/-/g, "_")}_API_KEY}\`,
    Accept: "application/json",`;
  }

  return `    "${headerName}": process.env.${api.slug.toUpperCase().replace(/-/g, "_")}_API_KEY,
    Accept: "application/json",`;
}

function buildAuthPython(api: ApiCatalogEntry): { setup: string; headers: string } {
  const auth = resolveAuth(api);
  const envName = `${api.slug.toUpperCase().replace(/-/g, "_")}_API_KEY`;

  if (auth.delivery === "none") {
    return {
      setup: "",
      headers: 'headers = {"Accept": "application/json"}',
    };
  }

  if (auth.delivery === "basic") {
    return {
      setup: "",
      headers: 'auth = ("YOUR_USERNAME", "YOUR_PASSWORD")',
    };
  }

  if (auth.delivery === "oauth") {
    return {
      setup: `import os\n\naccess_token = os.environ["${envName.replace("_API_KEY", "_TOKEN")}"]\n`,
      headers: 'headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}',
    };
  }

  if (auth.delivery === "query") {
    return {
      setup: "",
      headers: 'headers = {"Accept": "application/json"}',
    };
  }

  const headerName = auth.headerName ?? "Authorization";
  if (headerName.toLowerCase() === "authorization") {
    return {
      setup: `import os\n\napi_key = os.environ["${envName}"]\n`,
      headers: `headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/json"}`,
    };
  }

  return {
    setup: `import os\n\napi_key = os.environ["${envName}"]\n`,
    headers: `headers = {"${headerName}": api_key, "Accept": "application/json"}`,
  };
}

function appendAuthQuery(url: string, api: ApiCatalogEntry): string {
  const auth = resolveAuth(api);
  if (auth.delivery !== "query" || !auth.queryParam) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${auth.queryParam.name}=YOUR_API_KEY`;
}

export function buildEndpointSnippets(
  api: ApiCatalogEntry,
  endpoint: ApiEndpoint,
): EndpointSnippets {
  const url = appendAuthQuery(buildEndpointRequestUrl(api, endpoint), api);
  const escapedUrl = escapeDoubleQuotes(url);
  const authCurl = buildAuthCurlFlags(api);
  const method = endpoint.method.toUpperCase();

  const curl =
    method === "GET"
      ? `curl -X GET "${escapedUrl}" \\\n${authCurl.length ? `${authCurl.join("\n")} \\\n` : ""}  -H "Accept: application/json"`
      : `curl -X ${method} "${escapedUrl}" \\\n${authCurl.length ? `${authCurl.join("\n")} \\\n` : ""}  -H "Accept: application/json" \\
  -H "Content-Type: application/json"`;

  const jsHeaders = buildAuthJsHeaders(api);
  const javascript =
    method === "GET"
      ? `const response = await fetch("${escapedUrl}", {
  headers: {
${jsHeaders}
  },
});
const data = await response.json();
console.log(data);`
      : `const response = await fetch("${escapedUrl}", {
  method: "${method}",
  headers: {
${jsHeaders}
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ /* request body */ }),
});
const data = await response.json();
console.log(data);`;

  const { setup, headers } = buildAuthPython(api);
  const auth = resolveAuth(api);
  const pythonRequestArgs =
    auth.delivery === "basic"
      ? `response = requests.${method.toLowerCase()}("${escapedUrl}", auth=auth, headers={"Accept": "application/json"})`
      : `response = requests.${method.toLowerCase()}("${escapedUrl}", headers=headers)`;

  const python = `${setup}${headers}
${pythonRequestArgs}
response.raise_for_status()
print(response.json())`;

  return { curl, javascript, python };
}

export function buildSnippet(
  language: SnippetLanguage,
  api: ApiCatalogEntry,
  endpoint?: ApiEndpoint,
): string {
  const target = endpoint ?? api.endpoints[0];
  if (!target) {
    const url = api.baseUrl;
    switch (language) {
      case "javascript":
        return `const response = await fetch("${url}");\nconst data = await response.json();\nconsole.log(data);`;
      case "python":
        return `import requests\n\nresponse = requests.get("${url}")\nresponse.raise_for_status()\nprint(response.json())`;
      default:
        return `curl -X GET "${url}" \\\n  -H "Accept: application/json"`;
    }
  }

  const snippets = buildEndpointSnippets(api, target);
  switch (language) {
    case "javascript":
      return snippets.javascript;
    case "python":
      return snippets.python;
    default:
      return snippets.curl;
  }
}
