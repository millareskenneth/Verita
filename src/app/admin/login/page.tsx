"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { loginAdmin } from "@/lib/api/admin-client";
import { ADMIN_DEV_BYPASS } from "@/lib/auth/admin-dev-bypass";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function continueToAdmin(key: string = adminKey) {
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(key);
      router.replace("/admin");
    } catch {
      setError(
        ADMIN_DEV_BYPASS
          ? "Could not reach the backend. Start free-api-backend on port 8000."
          : "Invalid admin key. Check ADMIN_API_KEY in the backend environment.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await continueToAdmin();
  }

  async function handleDevBypass() {
    await continueToAdmin("");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10 sm:px-6">
      <Card className="w-full">
        <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {ADMIN_DEV_BYPASS
            ? "Local dev bypass is on — no admin key required."
            : "Enter the backend admin key to access moderation tools."}
        </p>

        {ADMIN_DEV_BYPASS ? (
          <div className="mt-6 space-y-4">
            <Button type="button" disabled={loading} className="w-full" onClick={handleDevBypass}>
              {loading ? "Opening dashboard..." : "Continue without key (local dev)"}
            </Button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Backend must run with <code className="text-xs">APP_ENV=development</code> and{" "}
              <code className="text-xs">ADMIN_API_KEY</code> unset. Set{" "}
              <code className="text-xs">NEXT_PUBLIC_ADMIN_DEV_BYPASS=false</code> before
              production.
            </p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="admin-key"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Admin key
              </label>
              <Input
                id="admin-key"
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Paste ADMIN_API_KEY from the backend .env"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        )}

        {ADMIN_DEV_BYPASS && error ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </Card>
    </div>
  );
}
