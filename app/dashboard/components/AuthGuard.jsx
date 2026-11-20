"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => {};

/**
 * AuthGuardContent enforces strict authentication protection on the Cafe Dashboard site.
 * If the user is unauthenticated or the session/token has expired, it blocks all page
 * content from rendering and immediately redirects to /dashboard/login.
 */
function AuthGuardContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useDashboardAuthStore();
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
