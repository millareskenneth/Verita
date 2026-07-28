import type { ApiEndpoint } from "@/types/api";

interface EndpointListProps {
  endpoints: ApiEndpoint[];
}

export function EndpointList({ endpoints }: EndpointListProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">Endpoints</h2>

      <div className="space-y-2">
        {endpoints.map((endpoint) => (
          <div
            key={`${endpoint.method}-${endpoint.path}`}
            className="min-w-0 rounded-lg border border-border bg-card px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                {endpoint.method}
              </span>
              <code className="min-w-0 break-all text-xs text-foreground">
                {endpoint.path}
              </code>
            </div>
            {endpoint.description ? (
              <p className="mt-1 text-xs text-muted-foreground">{endpoint.description}</p>
            ) : null}
            {endpoint.parameters?.length ? (
              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                {endpoint.parameters.map((parameter) => (
                  <li key={parameter.name} className="break-words">
                    <span className="font-medium text-foreground">{parameter.name}</span>{" "}
                    ({parameter.in}
                    {parameter.required ? ", req" : ""})
                    {parameter.example ? ` · ${parameter.example}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
