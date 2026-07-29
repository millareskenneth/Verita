"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { adminFetch, logoutAdmin } from "@/lib/api/admin-client";

interface AdminStats {
  totalApis: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load admin stats");
        }
        return response.json() as Promise<AdminStats>;
      })
      .then(setStats)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Operational view for catalog moderation, scan status, and review queues.
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
      </div>

      {error ? (
        <Card className="border-red-300 dark:border-red-900">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-zinc-500">Catalog entries</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalApis ?? "—"}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Pending submissions</p>
            <p className="mt-2 text-3xl font-bold">{stats?.pendingSubmissions ?? "—"}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Approved submissions</p>
            <p className="mt-2 text-3xl font-bold">{stats?.approvedSubmissions ?? "—"}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Rejected submissions</p>
            <p className="mt-2 text-3xl font-bold">{stats?.rejectedSubmissions ?? "—"}</p>
          </Card>
        </div>
      )}

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">Next steps</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Phase 4.2 will add catalog filters, rescan triggers, and submission approval flows.</li>
          <li>Admin API calls now require a signed-in session or bearer token.</li>
          <li>Use the backend admin key from your local `.env` to sign in.</li>
        </ul>
      </Card>
    </div>
  );
}
