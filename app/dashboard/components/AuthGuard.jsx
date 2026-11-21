"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
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
    "/dashboard",           // root overview — keep last so prefix check works correctly
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

/** Returns true when pathname is covered by the role's permitted list */
function isPermitted(roleKey, pathname) {
  const list = ROLE_PERMITTED[roleKey] ?? ROLE_PERMITTED.barista;
  // exact match first, then check for deeper sub-paths (/dashboard/scan/...)
  return list.some((allowed) => pathname === allowed || pathname.startsWith(allowed + "/"));
}

/**
 * AuthGuardContent enforces strict authentication + role-based route protection
 * on the Cafe Dashboard.  Unauthenticated users are redirected to /dashboard/login;
 * authenticated users who try to access a route their role cannot see are redirected
 * to their default landing page with an error toast.
 */
function AuthGuardContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, currentUser, checkAuth } = useDashboardAuthStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyStaffSession() {
      if (!isClient) return;

      // Don't protect the login page itself
      if (pathname === "/dashboard/login") {
        if (isMounted) setIsChecking(false);
        return;
      }

      const token = getAuthToken();

      // 1. If no token exists at all in storage, immediately redirect to /dashboard/login
      if (!token && !isAuthenticated) {
        if (isMounted) {
          router.replace("/dashboard/login");
          setIsChecking(false);
        }
        return;
      }

      // 2. Always verify with the backend to ensure token has not expired
      const res = await checkAuth();
      if (!res?.success) {
        if (isMounted) {
          router.replace("/dashboard/login");
          setIsChecking(false);
        }
        return;
      }

      if (isMounted) {
        // 3. Role-based route guard
        const user = res.user ?? useDashboardAuthStore.getState().currentUser;
        const roleKey = user?.roleKey ?? "barista";
        const defaultRoute = roleKey === "barista" ? "/dashboard/scan" : "/dashboard";

        // Baristas landing on root overview → silently redirect, no toast
        if (roleKey === "barista" && pathname === "/dashboard") {
          router.replace("/dashboard/scan");
          setIsChecking(false);
          return;
        }

        if (!isPermitted(roleKey, pathname)) {
          toast.error("Access Restricted: Your role does not have permission for this page.");
          router.replace(defaultRoute);
          setIsChecking(false);
          return;
        }

        setIsChecking(false);
      }
    }

    verifyStaffSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, isClient, checkAuth, router]);

  // Don't protect the login page itself
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // Prevent any dashboard content from opening while verifying
  if (!isClient || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Verifying Cafe Staff Access...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, block render completely
  if (!isAuthenticated && !getAuthToken()) {
    return null;
  }

  return <>{children}</>;
}

export default function AuthGuard({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          </div>
        </div>
      }
    >
      <AuthGuardContent>{children}</AuthGuardContent>
    </Suspense>
  );
}
