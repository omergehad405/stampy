"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCoffee,
  LuBell,
  LuArrowRight,
  LuSparkles,
  LuStore,
  LuCompass,
} from "react-icons/lu";

import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

export default function MyCafesPage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { getJoinedCafes, leaveCafe } = useLoyaltyStore();
  const joinedCafes = getJoinedCafes();

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      {/* Top Bar Header */}
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--mainColor)]/10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-[var(--mainColor)] flex items-center justify-center text-[var(--bgColor)] shadow-sm shrink-0">
            <LuCompass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm lg:text-base font-bold leading-tight text-[var(--mainColor)] truncate">
              Stampy
            </h2>
            <p className="text-[11px] sm:text-xs font-medium opacity-70 truncate">
              Digital Loyalty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer shrink-0"
          >
            <LuBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondColor)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--secondColor)]"></span>
            </span>
          </button>
        </div>
      </header>

      {/* Page Title & Overview */}
      <section className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
            YOUR LOYALTY HUBS
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-0.5 tracking-tight flex items-center gap-2 text-[var(--mainColor)]">
            <span>My Cafes</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3b2418]">
              {joinedCafes.length} {joinedCafes.length === 1 ? "Cafe" : "Cafes"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 max-w-xl">
            All cafes you have joined with your Stampy account. Open any cafe to view your loyalty card, stamp slots, and rewards.
          </p>
        </div>
      </section>

      {/* Content Area: Empty State OR Joined Cafes Grid */}
      <div className="mt-8">
        {joinedCafes.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--bgColor)]/15 text-[var(--bgColor)] flex items-center justify-center mb-4">
              <LuCoffee className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[var(--bgColor)]">
              No Cafes Joined Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--bgColor)]/75 mt-1.5 max-w-sm">
              You haven&apos;t joined any cafe loyalty programs yet. Visit a participating cafe and scan their QR code to start collecting stamps!
            </p>
          </motion.div>
        ) : (
          /* Joined Cafes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <AnimatePresence>
              {joinedCafes.map((cafe) => {
                const progressPercent = Math.min(
                  Math.round((cafe.currentStamps / cafe.totalStamps) * 100),
                  100
                );

                return (
                  <motion.div
                    key={cafe.slug}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm hover:shadow-md hover:border-[var(--secondColor)] transition-all duration-300"
                  >
                    <div>
                      {/* Top Row: Cafe Logo, Name, Badge */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[var(--bgColor)]/10 shrink-0 border border-[var(--bgColor)]/20">
                          {cafe.logoImage ? (
                            <Image
                              src={cafe.logoImage}
                              alt={cafe.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--bgColor)]">
                              <LuStore className="w-7 h-7" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-[var(--bgColor)] truncate">
                              {cafe.name}
                            </h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3b2418] shrink-0">
                              Joined
                            </span>
                          </div>

                          <p className="text-xs text-[var(--bgColor)]/75 truncate mt-0.5">
                            {cafe.category || cafe.tagline}
                          </p>

                          <p className="text-[11px] text-[var(--bgColor)]/60 mt-1 flex items-center gap-1">
                            <span>{cafe.location?.district || cafe.location?.city}</span>
                            <span>•</span>
                            <span>{cafe.totalStamps} Stamp Card</span>
                          </p>
                        </div>
                      </div>

                      {/* Stamp Progress Bar & Count */}
                      <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[var(--bgColor)]/10 border border-[var(--bgColor)]/15">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--bgColor)]">
                          <span className="flex items-center gap-1.5">
                            <LuCoffee className="w-3.5 h-3.5 opacity-80" />
                            <span>Stamp Progress</span>
                          </span>
                          <span className="text-xs font-extrabold bg-[var(--secondColor)] text-[#3b2418] px-2.5 py-0.5 rounded-full">
                            {cafe.currentStamps} / {cafe.totalStamps}
                          </span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-2 rounded-full bg-[var(--bgColor)]/20 mt-2.5 overflow-hidden">
                          <div
                            className="h-full bg-[var(--secondColor)] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        {/* Next Available Reward */}
                        <div className="mt-3 flex items-center justify-between text-xs text-[var(--bgColor)]/85 pt-2.5 border-t border-[var(--bgColor)]/15">
                          <span className="flex items-center gap-1 truncate font-medium">
                            <LuSparkles className="w-3.5 h-3.5 text-[var(--secondColor)] shrink-0" />
                            <span className="truncate">
                              {cafe.nextReward
                                ? `Next: ${cafe.nextReward.name} (${cafe.nextReward.stampsRequired} stamps)`
                                : "Reward unlocked!"}
                            </span>
                          </span>
                          <span className="text-[11px] font-semibold text-[var(--bgColor)]/70 shrink-0 ml-2">
                            {Math.max(0, (cafe.nextReward?.stampsRequired || cafe.totalStamps) - cafe.currentStamps)} to go
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-5 pt-3 border-t border-[var(--bgColor)]/15 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => leaveCafe(cafe.slug)}
                        className="text-xs text-[var(--bgColor)]/60 hover:text-rose-400 transition-colors cursor-pointer py-1 px-2"
                        title="Leave this cafe's loyalty program"
                      >
                        Leave
                      </button>

                      <Link
                        href={`/cafe/${cafe.slug}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--secondColor)] hover:opacity-95 active:scale-95 text-[#3b2418] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                      >
                        <span>Open Cafe</span>
                        <LuArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Notification Box Drawer */}
      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
