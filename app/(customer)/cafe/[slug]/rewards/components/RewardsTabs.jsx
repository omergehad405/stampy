"use client";

import React from "react";
import { LuGift, LuHistory } from "react-icons/lu";

export default function RewardsTabs({
  cafe,
  activeTab,
  onChange,
  unlockedCount,
  pendingCount,
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-b border-(--mainColor)/15 pb-2">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => onChange("available")}
          className={`relative flex items-center gap-2 text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${activeTab === "available"
            ? "bg-(--mainColor) text-(--bgColor) shadow-xs"
            : "text-(--mainColor)/70 hover:text-(--mainColor) hover:bg-(--mainColor)/5"
            }`}
        >
          <LuGift className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Available Rewards</span>
          {unlockedCount > 0 && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
              {unlockedCount} Unlocked
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("history")}
          className={`relative flex items-center gap-2 text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${activeTab === "history"
            ? "bg-(--mainColor) text-(--bgColor) shadow-xs"
            : "text-(--mainColor)/70 hover:text-(--mainColor) hover:bg-(--mainColor)/5"
            }`}
        >
          <LuHistory className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>My Rewards</span>
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              {pendingCount} Ready
            </span>
          )}
        </button>
      </div>

      <span className="hidden sm:inline-block text-xs opacity-60">
        Exclusive to {cafe.name}
      </span>
    </div>
  );
}
