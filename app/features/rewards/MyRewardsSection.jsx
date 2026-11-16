"use client";

import React from "react";
import {
  LuQrCode,
  LuCircleCheck,
  LuClock,
  LuCalendar,
  LuCoffee,
  LuChevronRight,
  LuCircleAlert,
} from "react-icons/lu";

export default function MyRewardsSection({
  redemptions = [],
  onOpenQr,
}) {
  if (!redemptions || redemptions.length === 0) {
    return (
      <div className="rounded-3xl p-8 sm:p-12 border border-[var(--mainColor)]/15 bg-white/40 dark:bg-black/15 text-center flex flex-col items-center justify-center my-6">
        <div className="w-14 h-14 rounded-2xl bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center mb-3">
          <LuCoffee className="w-7 h-7 opacity-75" />
        </div>
        <h4 className="text-base sm:text-lg font-bold">No Rewards Redeemed Yet</h4>
        <p className="text-xs sm:text-sm opacity-70 mt-1 max-w-sm">
          Collect stamps on every visit and turn them into free coffees, bakery desserts, and exclusive discounts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 my-4">
      {redemptions.map((item) => {
        const isPending = item.status === "pending";
        const isUsed = item.status === "used";
        const isExpired = item.status === "expired";

        return (
          <div
            key={item.id}
            className={`rounded-2xl lg:rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isPending
                ? "bg-white/90 dark:bg-black/35 border-[var(--secondColor)]/80 shadow-md ring-1 ring-[var(--secondColor)]/30"
                : "bg-white/50 dark:bg-black/15 border-[var(--mainColor)]/10 shadow-xs opacity-85"
            }`}
          >
            {/* Left: Icon & Info */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isPending
                    ? "bg-[var(--secondColor)] text-[#3B2418]"
                    : "bg-[var(--mainColor)]/10 text-[var(--mainColor)]"
                }`}
              >
                {isPending ? (
                  <LuQrCode className="w-6 h-6 animate-pulse" />
                ) : isUsed ? (
                  <LuCircleCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <LuClock className="w-6 h-6 text-red-500" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-[var(--mainColor)]">
                    {item.rewardName}
                  </h4>

                  {/* Status Badge */}
                  {isPending && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Ready to Scan
                    </span>
                  )}
                  {isUsed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)]/80">
                      Used
                    </span>
                  )}
                  {isExpired && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-300">
                      Expired
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-70 mt-1">
                  <span className="font-mono font-semibold">{item.code}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <LuCalendar className="w-3 h-3" />
                    {item.formattedDate}
                  </span>
                  <span>•</span>
                  <span>{item.stampsSpent} stamps</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isPending ? (
                <button
                  type="button"
                  onClick={() => onOpenQr(item)}
                  className="flex items-center gap-1.5 bg-[var(--secondColor)] hover:opacity-95 active:scale-[0.98] text-[#3B2418] font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  <LuQrCode className="w-4 h-4" />
                  View QR Code
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenQr(item)}
                  className="flex items-center gap-1 border border-[var(--mainColor)]/15 hover:bg-[var(--mainColor)]/5 text-[var(--mainColor)] font-medium text-xs py-1.5 px-3 rounded-lg cursor-pointer transition-all opacity-75 hover:opacity-100"
                >
                  <span>Details</span>
                  <LuChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
