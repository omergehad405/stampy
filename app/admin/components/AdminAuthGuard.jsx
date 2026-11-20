"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";
import { useAdminStore } from "@/app/stores/useAdminStore";

const emptySubscribe = () => () => {};

export default function AdminAuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAdminAuthStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!isClient) return;

      if (pathname === "/admin/login") {
        if (isMounted) setIsChecking(false);
        return;
      }

      let authed = isAuthenticated;
      if (!authed) {
        const res = await checkAuth();
        if (!res?.success) {
          if (isMounted) {
            router.push("/admin/login");
          }
          return;
        }
        authed = true;
      }

      // Preload cafes, customers, plans, and announcements from MongoDB
      // and wait for them so the dashboard renders with full data
      await Promise.allSettled([
        useAdminStore.getState().fetchCafes(),
        useAdminStore.getState().fetchCustomers(),
        useAdminStore.getState().fetchPlans(),
        useAdminStore.getState().fetchAnnouncements(),
      ]);

      if (isMounted) setIsChecking(false);
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [pathname, isClient]); // Only re-run if route pathname changes

  // Don't protect the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication or preloading data
  if (!isClient || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Loading Stampy Admin...
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
