"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { getAuthToken } from "@/app/lib/apiClient";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};

/**
 * Role → permitted route prefixes.
 * owner  : full access
 * manager: everything except users and settings
 * barista: only scan and activity
 */
const ROLE_PERMITTED = {
  owner: [
    "/dashboard/scan",
    "/dashboard/customers",
    "/dashboard/rewards",
    "/dashboard/profile",
    "/dashboard/users",
    "/dashboard/activity",
    "/dashboard/settings",
    "/dashboard",
  ],
  manager: [
    "/dashboard/scan",
    "/dashboard/customers",
    "/dashboard/rewards",
    "/dashboard/profile",
    "/dashboard/activity",
    "/dashboard",
  ],
  barista: [
    "/dashboard/scan",
    "/dashboard/activity",
  ],
};

function isPermitted(roleKey, pathname) {
  const list = ROLE_PERMITTED[roleKey] ?? ROLE_PERMITTED.barista;
  return list.some((allowed) => pathname === allowed || pathname.startsWith(allowed + "/"));
}

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, currentUser, checkAuth } = useDashboardAuthStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    // Login page does not need auth checking
    if (pathname === "/dashboard/login") {
      setIsReady(true);
      return;
    }

    const token = getAuthToken();

    // 1. If not authenticated and no token, redirect cleanly via Next.js router
    if (!token && !isAuthenticated) {
      router.replace("/dashboard/login");
      return;
    }

    // 2. Validate session with backend
    async function validate() {
      // If already authenticated in memory, allow immediate render
      if (isAuthenticated) {
        setIsReady(true);
      }

      const res = await checkAuth();
      if (isCancelled) return;

      if (!res?.success) {
        setIsReady(false);
        router.replace("/dashboard/login");
        return;
      }

      const user = res.user ?? useDashboardAuthStore.getState().currentUser;
      const roleKey = user?.roleKey ?? "barista";
      const defaultRoute = roleKey === "barista" ? "/dashboard/scan" : "/dashboard";

      if (roleKey === "barista" && pathname === "/dashboard") {
        router.replace("/dashboard/scan");
        return;
      }

      if (!isPermitted(roleKey, pathname)) {
        toast.error("Access Restricted: Your role does not have permission for this page.");
        router.replace(defaultRoute);
        return;
      }

      setIsReady(true);
    }

    validate();

    return () => {
      isCancelled = true;
    };
  }, [pathname, isAuthenticated, checkAuth, router]);

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // During SSR / static prerender, render children so Next.js PPR can validate the segment
  if (!isClient) {
    return <>{children}</>;
  }

  const token = typeof window !== "undefined" ? getAuthToken() : null;
  if (!isAuthenticated && !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Redirecting to login...
          </span>
        </div>
      </div>
    );
  }

  if (!isReady && !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Loading Cafe Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
