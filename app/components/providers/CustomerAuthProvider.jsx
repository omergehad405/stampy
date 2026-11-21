"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => {};

/**
 * CustomerAuthGuardContent checks authentication status and enforces redirection
 * to /login if the user is unauthenticated or the session has expired.
 */
function CustomerAuthGuardContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, fetchCurrentUser } = useLoyaltyStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Determine route categories
  const isDashboardRoute = pathname ? pathname.startsWith("/dashboard") : false;
  const isAdminRoute = pathname ? pathname.startsWith("/admin") : false;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  // Public customer routes that do not require authentication to browse
  const isCafeInfoRoute = pathname ? /\/cafe\/[^/]+\/info(\/.*)?$/.test(pathname) : false;
  const isPublicCafeRoute = pathname ? /^\/cafe\/[^/]+$/.test(pathname) : false;
  const isExcluded =
    isDashboardRoute ||
    isAdminRoute ||
    isAuthRoute ||
    isCafeInfoRoute ||
    isPublicCafeRoute;

  useEffect(() => {
    let isMounted = true;

    async function verifyCustomerSession() {
      if (!isClient) return;

      // Excluded routes (login, dashboard, admin, public cafe info) have their own guards or are public
      if (isExcluded) {
        if (isMounted) setIsVerifying(false);
        // If a stored token exists, populate customer session in background without blocking
        const storedToken = getAuthToken();
        if (storedToken && !isAuthenticated) {
          fetchCurrentUser();
        }
        return;
      }

      const token = getAuthToken();

      // 1. If no token exists at all in storage, immediately redirect to /login
      if (!token && !isAuthenticated) {
        if (isMounted) {
          router.replace("/login");
          setIsVerifying(false);
        }
        return;
      }

      // 2. Token exists or persisted session -> verify with backend to ensure it has not expired
      const res = await fetchCurrentUser();
      if (!res?.success) {
        // Token has expired or is invalid
        if (isMounted) {
          router.replace("/login");
          setIsVerifying(false);
        }
        return;
      }

      if (isMounted) {
        setIsVerifying(false);
      }
    }

    verifyCustomerSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, isClient, isExcluded, isAuthenticated, fetchCurrentUser, router]);

  // Pass through login, dashboard, and admin directly
  if (isExcluded) {
    return <>{children}</>;
  }

  // Prevent any customer content from opening while verifying
  if (!isClient || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Verifying Stampy Session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated after verification, block render completely
  if (!isAuthenticated && !getAuthToken()) {
    return null;
  }

  return <>{children}</>;
}

/**
 * CustomerAuthProvider wraps the guard in a Suspense boundary to satisfy
 * Next.js prerendering requirements for hooks reading URL data (usePathname).
 */
export default function CustomerAuthProvider({ children }) {
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
      <CustomerAuthGuardContent>{children}</CustomerAuthGuardContent>
    </Suspense>
  );
}
