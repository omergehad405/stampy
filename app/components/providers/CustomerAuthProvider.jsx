"use client";

import { useEffect, useRef } from "react";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

/**
 * CustomerAuthProvider ensures customer loyalty state, active card memberships,
 * and authenticated user profile remain synchronized across route transitions
 * and page reloads.
 */
export default function CustomerAuthProvider({ children }) {
  const fetchCurrentUser = useLoyaltyStore((state) => state.fetchCurrentUser);
  const isAuthenticated = useLoyaltyStore((state) => state.isAuthenticated);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only attempt background rehydration if a token or active session exists
    const token = getAuthToken();
    if ((token || isAuthenticated) && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, isAuthenticated]);

  return <>{children}</>;
}
