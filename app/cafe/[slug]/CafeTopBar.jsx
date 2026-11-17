"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuArrowLeft, LuCoffee, LuBell, LuStore } from "react-icons/lu";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";

export default function CafeTopBar({ cafe }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between gap-2 sm:gap-3 pb-3 border-b border-[var(--mainColor)]/10">
        {/* Left: Return to My Cafes + Cafe Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/my-cafes"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--mainColor)]/5 hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0"
            title="Return to My Cafes"
          >
            <LuArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">My Cafes</span>
          </Link>

          <div className="h-4 w-px bg-[var(--mainColor)]/20 shrink-0" />

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--mainColor)] text-[var(--bgColor)] flex items-center justify-center shrink-0 shadow-xs">
              <LuCoffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-[var(--mainColor)] truncate leading-tight">
                {cafe?.name || "Cafe"}
              </h2>
              <p className="text-[10px] sm:text-xs opacity-70 truncate leading-tight">
                {cafe?.category || "Loyalty Partner"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Theme & Notifications */}
        <div className="flex items-center gap-1 shrink-0">
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

      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
