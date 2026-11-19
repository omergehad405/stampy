"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

const emptySubscribe = () => () => {};

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useDashboardAuthStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (isClient && !isAuthenticated && pathname !== "/dashboard/login") {
      router.push("/dashboard/login");
    }
  }, [isAuthenticated, pathname, router, isClient]);

  // Don't protect the login page itself
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // Allow render once confirmed authenticated
  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Loading Stampy Dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
