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
    <Card className="min-w-0 overflow-hidden">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-medium text-muted-foreground">
          Status: <span className="text-foreground">{response.status}</span>
        </span>
        <span className="font-medium text-muted-foreground">
          Latency: <span className="text-foreground">{response.latencyMs} ms</span>
        </span>
      </div>
      <pre className="max-h-44 overflow-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted p-3 text-xs text-foreground">
        {formattedBody}
      </pre>
    </Card>
  );
}
