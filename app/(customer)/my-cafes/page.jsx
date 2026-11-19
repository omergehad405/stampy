"use client";

import React from "react";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import MyCafesHeader from "./components/MyCafesHeader";
import MyCafesOverview from "./components/MyCafesOverview";
import MyCafesEmptyState from "./components/MyCafesEmptyState";
import JoinedCafesGrid from "./components/JoinedCafesGrid";

export default function MyCafesPage() {
  const { getJoinedCafes, leaveCafe } = useLoyaltyStore();
  const joinedCafes = getJoinedCafes();

  return (
    <div className="w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      <MyCafesHeader />

      <MyCafesOverview cafeCount={joinedCafes.length} />

      <div className="mt-8">
        {joinedCafes.length === 0 ? (
          <MyCafesEmptyState />
        ) : (
          <JoinedCafesGrid cafes={joinedCafes} onLeave={leaveCafe} />
        )}
      </div>
    </div>
  );
}
