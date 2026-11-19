"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuCheck, LuLock, LuSparkles } from "react-icons/lu";
import RewardVisual from "./RewardVisual";

export default function RewardCard({
  reward,
  stampsBalance,
  onRedeem,
}) {
  const isUnlocked = stampsBalance >= reward.stampsRequired;
  const stampsNeeded = reward.stampsRequired - stampsBalance;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`relative flex flex-col justify-between rounded-2xl lg:rounded-3xl p-5 sm:p-6 transition-all duration-300 border bg-(--mainColor) text-(--bgColor) ${isUnlocked
        ? "border-(--bgColor)/20 shadow-md hover:shadow-lg hover:border-(--secondColor)"
        : "border-(--bgColor)/10 shadow-xs opacity-85 hover:opacity-100"
        }`}
    >
      <div>
        {/* Top Header: Visual Icon + Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-(--bgColor)/15 p-1 border border-(--bgColor)/20 shrink-0">
            <RewardVisual iconType={reward.iconType} className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Required Stamps Badge */}
            <span
              className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${isUnlocked
                ? "bg-(--secondColor) text-[#3b2418] shadow-xs"
                : "bg-(--bgColor)/15 text-(--bgColor)"
                }`}
            >
              {reward.stampsRequired} Stamps
            </span>

            {/* Availability status badge */}
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <LuCheck className="w-3 h-3" />
                Available to Redeem
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-(--bgColor)/70 bg-(--bgColor)/10 px-2.5 py-0.5 rounded-full">
                <LuLock className="w-3 h-3" />
                Need {stampsNeeded} more {stampsNeeded === 1 ? "stamp" : "stamps"}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-(--bgColor)">
              {reward.name}
            </h3>
            {reward.tag && isUnlocked && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-(--secondColor) text-[#3b2418]">
                <LuSparkles className="w-2.5 h-2.5" />
                {reward.tag}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 leading-relaxed">
            {reward.description}
          </p>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="mt-5 pt-4 border-t border-(--bgColor)/15">
        {isUnlocked ? (
          <button
            type="button"
            onClick={() => onRedeem(reward)}
            className="w-full flex items-center justify-center gap-2 bg-(--secondColor) hover:opacity-95 active:scale-[0.99] text-[#3B2418] font-bold text-sm sm:text-base py-3 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
          >
            <LuSparkles className="w-4 h-4" />
            Redeem Reward
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 bg-(--bgColor)/10 text-(--bgColor)/45 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl text-center cursor-not-allowed select-none"
          >
            <LuLock className="w-3.5 h-3.5" />
            Collect {stampsNeeded} More {stampsNeeded === 1 ? "Stamp" : "Stamps"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
