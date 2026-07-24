import { Card } from "@/components/ui/Card";

interface ResponseViewerProps {
  response: {
    status: number;
    latencyMs: number;
    body: string;
  };
}

export function ResponseViewer({ response }: ResponseViewerProps) {
  let formattedBody = response.body;

  try {
    formattedBody = JSON.stringify(JSON.parse(response.body), null, 2);
  } catch {
    // Keep raw body when response is not JSON.
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Status:{" "}
          <span className="text-zinc-950 dark:text-zinc-50">{response.status}</span>
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Latency:{" "}
          <span className="text-zinc-950 dark:text-zinc-50">
            {response.latencyMs} ms
          </span>
        </span>
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
        {formattedBody}
      </pre>
    </Card>
  );
}
