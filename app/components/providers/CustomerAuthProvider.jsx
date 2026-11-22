"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => {};

function CustomerAuthContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, fetchCurrentUser } = useLoyaltyStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isReady, setIsReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getAuthToken() || isAuthenticated);
  });

  // Determine route categories
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isCafeInfoRoute = pathname ? /\/cafe\/[^/]+\/info(\/.*)?$/.test(pathname) : false;
  const isPublicCafeRoute = pathname ? /^\/cafe\/[^/]+$/.test(pathname) : false;
  const isPublicRoute = isAuthRoute || isCafeInfoRoute || isPublicCafeRoute;

  useEffect(() => {
    let isCancelled = false;

    // Public routes don't block render
    if (isPublicRoute) {
      setIsReady(true);
      const token = getAuthToken();
      if (token && !isAuthenticated) {
        fetchCurrentUser();
      }
      return;
    }

    if (!isClient) return;

    const token = getAuthToken();

    // 1. If not authenticated and no token, redirect to login
    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // If already authenticated with token, allow render immediately
    if (isAuthenticated && token) {
      setIsReady(true);
    }

    // 2. Validate token with backend
    async function validate() {
      const res = await fetchCurrentUser();
      if (isCancelled) return;

      if (!res?.success) {
        setIsReady(false);
        router.replace("/login");
        return;
      }

      setIsReady(true);
    }

    validate();

    return () => {
      isCancelled = true;
    };
  }, [pathname, isClient, isPublicRoute, isAuthenticated, fetchCurrentUser, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!isClient || !isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Loading Stampy...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function CustomerAuthProvider({ children }) {
  return (
    <Suspense fallback={null}>
      <CustomerAuthContent>{children}</CustomerAuthContent>
    </Suspense>
  );
}
