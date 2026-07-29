import { getReadinessStatus } from "@/lib/constants/catalog-readiness";
import { buildEndpointSnippets } from "@/lib/integration/build-code-snippets";
import {
  buildEndpointRequestUrl,
  buildRequestLine,
} from "@/lib/integration/build-endpoint-url";
import { resolveAuth } from "@/lib/integration/resolve-auth";
import { formatAuthMethod } from "@/lib/utils/format";
import type { ApiCatalogEntry, ApiEndpoint, ApiParameter } from "@/types/api";
import type { CatalogReadinessStatus } from "@/types/api";

export interface IntegrationStep {
  title: string;
  detail: string;
}

export interface EndpointIntegrationDoc {
  endpoint: ApiEndpoint;
  requestLine: string;
  requestUrl: string;
  parameterNotes: string[];
  snippets: ReturnType<typeof buildEndpointSnippets>;
}

export interface IntegrationGuide {
  readiness: CatalogReadinessStatus;
  summary: string;
  prerequisites: IntegrationStep[];
  authSetup: IntegrationStep[];
  authCaveat?: string;
  quickStart: IntegrationStep[];
  endpoints: EndpointIntegrationDoc[];
  rateLimit?: string;
  errorHandling: IntegrationStep[];
  officialDocsUrl: string;
  responseExample?: string;
  requestExample?: string;
  hasStructuredEndpoints: boolean;
  limitations: string[];
}

function formatParameterNote(param: ApiParameter): string {
  const parts = [`\`${param.name}\` (${param.in})`];
  if (param.required) parts.push("required");
  if (param.example) parts.push(`example: \`${param.example}\``);
  if (param.description) parts.push(param.description);
  return parts.join(" · ");
}

function buildAuthSetup(api: ApiCatalogEntry): {
  steps: IntegrationStep[];
  caveat?: string;
} {
  const auth = resolveAuth(api);
  const officialUrl = api.sourceUrl || api.baseUrl;

  if (auth.delivery === "none") {
    return {
      steps: [
        {
          title: "No authentication required",
          detail: `${api.name} does not require an API key or token for the documented endpoints. Send requests directly to the base URL.`,
        },
      ],
    };
  }

  if (auth.delivery === "oauth") {
    return {
      steps: [
        {
          title: "Register an OAuth application",
          detail: `Create an app in the provider's developer portal linked from ${officialUrl}. Note your client ID, client secret, and approved redirect URI.`,
        },
        {
          title: "Implement the authorization flow",
          detail:
            "Exchange an authorization code for an access token using the provider's token endpoint. OAuth flows vary by provider — follow their official guide for scopes, grant types, and refresh tokens.",
        },
        {
          title: "Attach the access token to requests",
          detail:
            "Include `Authorization: Bearer <access_token>` on each API call. Refresh or re-authenticate when the token expires.",
        },
      ],
      caveat:
        "OAuth setup is provider-specific. Verita lists the auth type from catalog metadata; the exact endpoints and scopes are in the official documentation.",
    };
  }

  if (auth.delivery === "basic") {
    return {
      steps: [
        {
          title: "Obtain credentials",
          detail: `Sign up or log in at ${officialUrl} and create API credentials (username/password or client ID/secret pair).`,
        },
        {
          title: "Send HTTP Basic authentication",
          detail:
            "Encode `username:password` as Base64 and send `Authorization: Basic <encoded>` on every request, or use your HTTP client's built-in basic auth helper.",
        },
      ],
    };
  }

  if (auth.delivery === "query" && auth.queryParam) {
    return {
      steps: [
        {
          title: "Get an API key",
          detail: `Register at ${officialUrl} and copy your API key from the provider dashboard.`,
        },
        {
          title: "Pass the key as a query parameter",
          detail: `Add \`${auth.queryParam.name}=YOUR_API_KEY\` to the request URL${auth.queryParam.required ? " (required on every call)" : ""}.`,
        },
        {
          title: "Store the key securely",
          detail: `Use an environment variable such as \`${api.slug.toUpperCase().replace(/-/g, "_")}_API_KEY\` — never commit keys to source control.`,
        },
      ],
      caveat: auth.needsOfficialDocs
        ? "The query parameter name above comes from Verita's catalog. Confirm it matches the provider's current documentation."
        : undefined,
    };
  }

  const headerName = auth.headerName ?? "Authorization";
  const headerDetail =
    headerName.toLowerCase() === "authorization"
      ? "Send `Authorization: Bearer YOUR_API_KEY` on each request."
      : `Send \`${headerName}: YOUR_API_KEY\` as an HTTP header on each request.`;

  return {
    steps: [
      {
        title: "Get an API key",
        detail: `Register at ${officialUrl} and create an API key from the provider's dashboard or developer settings.`,
      },
      {
        title: "Attach the key to requests",
        detail: headerDetail,
      },
      {
        title: "Store the key securely",
        detail: `Use an environment variable such as \`${api.slug.toUpperCase().replace(/-/g, "_")}_API_KEY\` — never commit keys to source control.`,
      },
    ],
    caveat: auth.needsOfficialDocs
      ? `${api.name} requires an API key, but Verita does not have the exact header or query parameter name on file. Open the official documentation to confirm whether the provider uses a custom header (e.g. \`X-Api-Key\`), a query parameter, or a Bearer token.`
      : undefined,
  };
}

function buildPrerequisites(
  api: ApiCatalogEntry,
  readiness: CatalogReadinessStatus,
): IntegrationStep[] {
  const steps: IntegrationStep[] = [];

  if (readiness === "docs-only") {
    steps.push({
      title: "Review official documentation",
      detail: `Endpoint details for ${api.name} are not fully indexed on Verita yet. Start with the official source at ${api.sourceUrl || api.baseUrl}.`,
    });
  }

  if (api.authMethod !== "none") {
    steps.push({
      title: "Account or API key",
      detail: `${formatAuthMethod(api.authMethod)} is required. Create an account with the provider before making live calls.`,
    });
  } else {
    steps.push({
      title: "No signup required",
      detail: "You can call the documented endpoints immediately — no API key or OAuth setup needed.",
    });
  }

  steps.push({
    title: "HTTP client",
    detail:
      "Use cURL, fetch, requests, or any HTTP library. The Try it now panel on this page can validate the first request.",
  });

  return steps;
}

function buildQuickStart(
  api: ApiCatalogEntry,
  readiness: CatalogReadinessStatus,
): IntegrationStep[] {
  const auth = resolveAuth(api);

  if (readiness === "docs-only" || api.endpoints.length === 0) {
    return [
      {
        title: "Open the official docs",
        detail: `Visit ${api.sourceUrl || api.baseUrl} for the complete endpoint reference, request formats, and authentication details.`,
      },
      {
        title: "Configure authentication",
        detail:
          auth.delivery === "none"
            ? "No credentials are listed — confirm in the official docs whether a key is needed."
            : `Set up ${formatAuthMethod(api.authMethod).toLowerCase()} using the provider's signup flow.`,
      },
      {
        title: "Test a sample request",
        detail: `Once you have the correct URL and parameters from the provider, test with cURL or the code snippets below using base URL ${api.baseUrl}.`,
      },
    ];
  }

  const first = api.endpoints[0];
  const url = buildEndpointRequestUrl(api, first);
  const steps: IntegrationStep[] = [
    {
      title: "Pick an endpoint",
      detail: first.description
        ? `${first.method} ${first.path} — ${first.description}`
        : `Start with ${first.method} ${first.path}.`,
    },
  ];

  const requiredParams = (first.parameters ?? []).filter((p) => p.required);
  if (requiredParams.length > 0) {
    steps.push({
      title: "Set required parameters",
      detail: requiredParams.map((p) => formatParameterNote(p)).join("; "),
    });
  }

  if (auth.delivery !== "none" && auth.delivery !== "oauth") {
    steps.push({
      title: "Add credentials",
      detail:
        auth.delivery === "query" && auth.queryParam
          ? `Append your API key as the \`${auth.queryParam.name}\` query parameter.`
          : "Add your API key or basic auth credentials to the request headers.",
    });
  }

  steps.push({
    title: "Send the request",
    detail: `Call \`${url}\` and parse the JSON response. Use the code examples below for your language.`,
  });

  return steps;
}

function buildErrorHandling(api: ApiCatalogEntry): IntegrationStep[] {
  return [
    {
      title: "401 / 403 — authentication failed",
      detail:
        api.authMethod === "none"
          ? "Unexpected for a no-auth API — the provider may have changed requirements. Check the official docs."
          : "Verify your API key, token, or basic credentials. Confirm the header or query parameter name matches the provider's documentation.",
    },
    {
      title: "404 — not found",
      detail:
        "Check the path, path parameters, and base URL. Replace `{param}` placeholders with real values before sending.",
    },
    {
      title: "429 — rate limited",
      detail: api.rateLimit
        ? `This API documents limits: ${api.rateLimit}. Back off and retry with exponential delay.`
        : "Slow down request frequency and implement retry logic with backoff.",
    },
    {
      title: "CORS in the browser",
      detail:
        "Some APIs block browser-origin requests. Call from your backend server, or use the Verita Try it now panel which falls back to a server-side proxy when CORS blocks direct calls.",
    },
  ];
}

function buildEndpointDocs(api: ApiCatalogEntry): EndpointIntegrationDoc[] {
  return api.endpoints.map((endpoint) => ({
    endpoint,
    requestLine: buildRequestLine(api, endpoint),
    requestUrl: buildEndpointRequestUrl(api, endpoint),
    parameterNotes: (endpoint.parameters ?? []).map(formatParameterNote),
    snippets: buildEndpointSnippets(api, endpoint),
  }));
}

function buildSummary(api: ApiCatalogEntry, readiness: CatalogReadinessStatus): string {
  const authLabel = formatAuthMethod(api.authMethod).toLowerCase();
  const endpointCount = api.endpoints.length;

  if (readiness === "plug-and-play") {
    return endpointCount > 0
      ? `${api.name} is ready to integrate: ${endpointCount} documented endpoint${endpointCount === 1 ? "" : "s"}, no API key, and examples generated from Verita's catalog data.`
      : `${api.name} requires no API key. Use the base URL below and confirm paths in the official documentation.`;
  }

  if (readiness === "api-key-required") {
    return endpointCount > 0
      ? `Integrate ${api.name} with ${authLabel}. Verita documents ${endpointCount} endpoint${endpointCount === 1 ? "" : "s"} with parameter examples; obtain credentials from the provider first.`
      : `${api.name} requires ${authLabel}. Verita has catalog metadata but no structured endpoints yet — follow the provider's official guide.`;
  }

  return `${api.name} is listed for discovery. Verita has not parsed full endpoint documentation yet — use the official source for accurate integration steps.`;
}

function buildLimitations(
  api: ApiCatalogEntry,
  readiness: CatalogReadinessStatus,
): string[] {
  const limits = [
    "Integration guides on Verita are generated from catalog metadata. Always confirm request formats, auth headers, and response schemas against the provider's official documentation before production use.",
  ];

  if (readiness === "docs-only") {
    limits.push(
      "Endpoint paths and parameters shown here may be incomplete. Do not rely on generated code snippets without verifying them against the official API reference.",
    );
  }

  const auth = resolveAuth(api);
  if (auth.needsOfficialDocs && api.authMethod === "api-key") {
    limits.push(
      "The exact API key header or query parameter name was not found in Verita's catalog — confirm it in the provider's docs before deploying.",
    );
  }

  if (api.endpoints.some((e) => e.method !== "GET")) {
    limits.push(
      "Write-operation examples use placeholder request bodies. Refer to the official docs for required JSON fields and validation rules.",
    );
  }

  return limits;
}

export function buildIntegrationGuide(api: ApiCatalogEntry): IntegrationGuide {
  const readiness = getReadinessStatus(api);
  const authSetupResult = buildAuthSetup(api);
  const hasStructuredEndpoints = api.endpoints.length > 0;

  return {
    readiness,
    summary: buildSummary(api, readiness),
    prerequisites: buildPrerequisites(api, readiness),
    authSetup: authSetupResult.steps,
    authCaveat: authSetupResult.caveat,
    quickStart: buildQuickStart(api, readiness),
    endpoints: hasStructuredEndpoints ? buildEndpointDocs(api) : [],
    rateLimit: api.rateLimit,
    errorHandling: buildErrorHandling(api),
    officialDocsUrl: api.sourceUrl || api.baseUrl,
    responseExample: api.responseExample,
    requestExample: api.requestExample,
    hasStructuredEndpoints,
    limitations: buildLimitations(api, readiness),
  };
}
