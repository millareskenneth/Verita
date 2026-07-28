"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminSession } from "@/lib/api/admin-client";
import { ADMIN_DEV_BYPASS } from "@/lib/auth/admin-dev-bypass";
import { getAdminToken } from "@/lib/auth/admin-session";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ADMIN_DEV_BYPASS) {
      setReady(true);
      return;
    }

    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let cancelled = false;

    fetchAdminSession()
      .then(() => {
        if (!cancelled) {
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          router.replace("/admin/login");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-zinc-500">
        Checking admin session...
      </div>
    );
  }

  return <>{children}</>;
}
