"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LuStore, LuSparkles } from "react-icons/lu";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

import MyCafesHeader from "./components/MyCafesHeader";
import MyCafesOverview from "./components/MyCafesOverview";
import MyCafesEmptyState from "./components/MyCafesEmptyState";
import JoinedCafesGrid from "./components/JoinedCafesGrid";
import SuggestedCafesSection from "./components/SuggestedCafesSection";

const emptySubscribe = () => () => { };

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function MyCafesPage() {
  const router = useRouter();
  const isMounted = useIsClient();
  const { isAuthenticated, getJoinedCafes, leaveCafe } = useLoyaltyStore();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const isAuthorized = Boolean(
    typeof window !== "undefined" && (getAuthToken() || isAuthenticated)
  );

  if (!isMounted || !isAuthorized) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
      </div>
    );
  }

  const joinedCafes = getJoinedCafes();

  return (
    <div className="w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16 space-y-10">
      <MyCafesHeader />

      <MyCafesOverview cafeCount={joinedCafes.length} />

      {/* Section 1: My Cafes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-(--mainColor)/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-(--mainColor) text-(--bgColor)">
              <LuStore className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-(--mainColor)">
              My Cafes
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-(--mainColor)/10 text-(--mainColor)">
            {joinedCafes.length} {joinedCafes.length === 1 ? "Active Card" : "Active Cards"}
          </span>
        </div>

        {joinedCafes.length === 0 ? (
          <MyCafesEmptyState />
        ) : (
          <JoinedCafesGrid cafes={joinedCafes} onLeave={leaveCafe} />
        )}
      </section>

      {/* Section 2: Suggested Cafes */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-(--mainColor)/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-(--secondColor) text-[#3B2418]">
              <LuSparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-(--mainColor)">
              Suggested Cafes
            </h2>
          </div>
          <span className="text-xs font-semibold opacity-60">
            Random recommendations
          </span>
        </div>

        <SuggestedCafesSection />
      </section>
    </div>
  );
}
