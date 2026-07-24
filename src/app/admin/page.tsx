import { Card } from "@/components/ui/Card";
import { MOCK_APIS } from "@/data/mock-apis";

export default function AdminDashboardPage() {
  const pendingReview = MOCK_APIS.filter((api) => api.freeStatus === "under-review");
  const flagged = MOCK_APIS.filter((api) => api.trustScore < 70);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Operational view for catalog moderation, scan status, and review queues.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-500">Catalog entries</p>
          <p className="mt-2 text-3xl font-bold">{MOCK_APIS.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Pending review</p>
          <p className="mt-2 text-3xl font-bold">{pendingReview.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Flagged APIs</p>
          <p className="mt-2 text-3xl font-bold">{flagged.length}</p>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">Next steps</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Connect to backend admin endpoints for scan jobs and quarantine actions.</li>
          <li>Surface submission review queue once Phase 2 forms are enabled.</li>
          <li>Add auth guard before exposing this route in production.</li>
        </ul>
      </Card>
    </div>
  );
}
