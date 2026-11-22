"use client";

import React from "react";
import { LuStore, LuSparkles } from "react-icons/lu";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import MyCafesHeader from "./components/MyCafesHeader";
import MyCafesOverview from "./components/MyCafesOverview";
import MyCafesEmptyState from "./components/MyCafesEmptyState";
import JoinedCafesGrid from "./components/JoinedCafesGrid";
import SuggestedCafesSection from "./components/SuggestedCafesSection";

export default function MyCafesPage() {
  const { getJoinedCafes, leaveCafe } = useLoyaltyStore();
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
