"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";
import { useAdminStore } from "@/app/stores/useAdminStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => { };

export default function AdminAuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAdminAuthStore();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isReady, setIsReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getAuthToken() || isAuthenticated);
  });

  useEffect(() => {
    let isCancelled = false;

    if (pathname === "/admin/login") {
      setIsReady(true);
      return;
    }

    if (!isClient) return;

    const token = getAuthToken();
    if (!token && !isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (isAuthenticated && token) {
      setIsReady(true);
    }

    async function validate() {
      let authed = isAuthenticated;
      if (!authed) {
        const res = await checkAuth();
        if (isCancelled) return;
        if (!res?.success) {
          setIsReady(false);
          router.replace("/admin/login");
          return;
        }
        authed = true;
      }

      await Promise.allSettled([
        useAdminStore.getState().fetchCafes(),
        useAdminStore.getState().fetchCustomers(),
        useAdminStore.getState().fetchPlans(),
        useAdminStore.getState().fetchAnnouncements(),
      ]);

      if (!isCancelled) {
        setIsReady(true);
      }
    }

    validate();

    return () => {
      isCancelled = true;
    };
  }, [pathname, isClient, isAuthenticated, checkAuth, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isClient || !isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--bgColor)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <span className="text-xs font-semibold tracking-wider text-(--mainColor)/70 uppercase">
            Loading Notch Admin...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
