import type { ApiEndpoint } from "@/types/api";

interface EndpointListProps {
  endpoints: ApiEndpoint[];
}

export function EndpointList({ endpoints }: EndpointListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Endpoints
      </h2>

      <div className="space-y-3">
        {endpoints.map((endpoint) => (
          <div
            key={`${endpoint.method}-${endpoint.path}`}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {endpoint.method}
              </span>
              <code className="text-sm text-zinc-800 dark:text-zinc-200">
                {endpoint.path}
              </code>
            </div>
            {endpoint.description ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {endpoint.description}
              </p>
            ) : null}
            {endpoint.parameters?.length ? (
              <ul className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {endpoint.parameters.map((parameter) => (
                  <li key={parameter.name}>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {parameter.name}
                    </span>{" "}
                    ({parameter.in}
                    {parameter.required ? ", required" : ""})
                    {parameter.example ? ` · e.g. ${parameter.example}` : ""}
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
