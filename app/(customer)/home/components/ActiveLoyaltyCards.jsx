"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LuCoffee, LuArrowRight, LuSparkles, LuStore } from "react-icons/lu";

export default function ActiveLoyaltyCards({ joinedCafes }) {
  const displayedCafes = (joinedCafes || []).slice(0, 3);
  const totalJoined = joinedCafes?.length || 0;

  return (
    <section aria-labelledby="continue-journey-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="continue-journey-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-[var(--mainColor)] flex items-center gap-2"
            >
              <span>Continue Your Journey</span>
              {totalJoined > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3B2418]">
                  {totalJoined} Active
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--mainColor)]/70 mt-0.5">
            Your active loyalty stamp cards ready for your next coffee stop.
          </p>
        </div>

        {totalJoined > 0 && (
          <Link
            href="/my-cafes"
            className="text-xs sm:text-sm font-bold text-[var(--mainColor)] hover:text-[#3B2418] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <LuArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Cards Grid or Empty State */}
      {displayedCafes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 text-center flex flex-col items-center justify-center shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--bgColor)]/15 text-[var(--bgColor)] flex items-center justify-center mb-3">
            <LuCoffee className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--bgColor)]">
            No Active Loyalty Cards Yet
          </h3>
          <p className="text-xs sm:text-sm text-[var(--bgColor)]/75 mt-1 max-w-sm">
            You haven&apos;t joined any café loyalty programs yet. Explore participating cafés below and collect your first stamp today!
          </p>
          <a
            href="#discover-cafes-section"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--secondColor)] text-[#3B2418] font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-xs"
          >
            <span>Discover Partner Cafés</span>
            <LuArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCafes.map((cafe, index) => {
            const current = cafe.currentStamps || 0;
            const target = cafe.totalStamps || 10;
            const progress = Math.min(Math.round((current / target) * 100), 100);

            const nextReward = cafe.nextReward;
            const isUnlocked = nextReward && current >= nextReward.stampsRequired;
            const stampsLeft = nextReward
              ? Math.max(0, nextReward.stampsRequired - current)
              : 0;

            return (
              <motion.div
                key={cafe.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between rounded-3xl p-5 bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm hover:shadow-md hover:border-[var(--secondColor)] transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Logo, Name, Category */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-13 h-13 rounded-2xl overflow-hidden bg-[var(--bgColor)]/10 shrink-0 border border-[var(--bgColor)]/20">
                      {cafe.logoImage ? (
                        <Image
                          src={cafe.logoImage}
                          alt={cafe.name}
                          fill
                          sizes="52px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--bgColor)]">
                          <LuStore className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[var(--bgColor)] truncate group-hover:underline">
                        {cafe.name}
                      </h3>
                      <p className="text-xs text-[var(--bgColor)]/75 truncate mt-0.5">
                        {cafe.category || cafe.tagline}
                      </p>
                      <p className="text-[11px] text-[var(--bgColor)]/60 mt-0.5">
                        {cafe.location?.district || cafe.location?.city || "London"}
                      </p>
                    </div>
                  </div>

                  {/* Stamp Progress Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[var(--bgColor)]/10 border border-[var(--bgColor)]/15">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--bgColor)]">
                      <span className="flex items-center gap-1.5">
                        <LuCoffee className="w-3.5 h-3.5 opacity-80" />
                        <span>Progress</span>
                      </span>
                      <span className="text-xs font-extrabold bg-[var(--secondColor)] text-[#3B2418] px-2.5 py-0.5 rounded-full">
                        {current} / {target} Stamps
                      </span>
                    </div>

                    {/* Visual Progress Bar Track */}
                    <div className="w-full h-2 rounded-full bg-[var(--bgColor)]/20 mt-2.5 overflow-hidden">
                      <div
                        className="h-full bg-[var(--secondColor)] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--bgColor)]/80">
                      <span className="font-semibold">{progress}% Completed</span>
                      <span className="opacity-70">{target - current} to free card</span>
                    </div>

                    {/* Next Reward Preview */}
                    {nextReward && (
                      <div className="mt-2 pt-2 border-t border-[var(--bgColor)]/15 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--bgColor)]/85 truncate">
                          <LuSparkles className="w-3 h-3 text-[var(--secondColor)] shrink-0" />
                          <span className="truncate">
                            Next: {nextReward.name}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold shrink-0 ml-1.5 px-2 py-0.5 rounded-full bg-[var(--bgColor)]/15 text-[var(--bgColor)]">
                          {isUnlocked ? "Unlocked 🎉" : `${stampsLeft} left`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-[var(--bgColor)]/15">
                  <Link
                    href={`/cafe/${cafe.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--secondColor)] hover:opacity-95 active:scale-95 text-[#3B2418] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  >
                    <span>Open Loyalty Card</span>
                    <LuArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
