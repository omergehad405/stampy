"use client";

import React from "react";
import {
  LuSparkles,
  LuQrCode,
  LuClock,
  LuCircleCheck,
  LuCalendar,
  LuChevronRight,
} from "react-icons/lu";

export default function MyRewardsSection({ redemptions = [], onOpenQr }) {
  if (!redemptions || redemptions.length === 0) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 text-center flex flex-col items-center justify-center my-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[var(--bgColor)]/15 text-[var(--bgColor)] flex items-center justify-center mb-3">
          <LuSparkles className="w-6 h-6 opacity-80" />
        </div>
        <h4 className="text-base sm:text-lg font-bold text-[var(--bgColor)]">
          No Rewards Redeemed Yet
        </h4>
        <p className="text-xs sm:text-sm text-[var(--bgColor)]/75 mt-1.5 max-w-sm">
          Collect stamps at your favorite cafés to unlock and redeem free drinks, pastries, and member perks.
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
            className={`rounded-2xl lg:rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--mainColor)] text-[var(--bgColor)] ${
              isPending
                ? "border-[var(--secondColor)]/80 shadow-md ring-1 ring-[var(--secondColor)]/30"
                : "border-[var(--bgColor)]/15 shadow-xs opacity-90"
            }`}
          >
            {/* Left: Icon & Info */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isPending
                    ? "bg-[var(--secondColor)] text-[#3B2418]"
                    : "bg-[var(--bgColor)]/15 text-[var(--bgColor)]"
                }`}
              >
                {isPending ? (
                  <LuQrCode className="w-6 h-6 animate-pulse" />
                ) : isUsed ? (
                  <LuCircleCheck className="w-6 h-6 text-emerald-400" />
                ) : (
                  <LuClock className="w-6 h-6 text-red-400" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-[var(--bgColor)]">
                    {item.rewardName}
                  </h4>

                  {/* Status Badge */}
                  {isPending && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Ready to Scan
                    </span>
                  )}
                  {isUsed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bgColor)]/15 text-[var(--bgColor)]/85">
                      Used
                    </span>
                  )}
                  {isExpired && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                      Expired
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-75 mt-1 text-[var(--bgColor)]">
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
                  className="flex items-center gap-1 border border-[var(--bgColor)]/20 hover:bg-[var(--bgColor)]/10 text-[var(--bgColor)] font-medium text-xs py-1.5 px-3 rounded-lg cursor-pointer transition-all opacity-85 hover:opacity-100"
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
