"use client";

import React from "react";
import { LuGift, LuSparkles } from "react-icons/lu";

export default function StampProgress({
  currentStamps,
  totalStamps,
  rewards = [],
}) {
  const effectiveTotal = totalStamps > 0 ? totalStamps : 10;
  // Calculate completed cycles and the displayed progress inside the current 10-stamp card
  const completedCycles = Math.floor(currentStamps / effectiveTotal);
  const displayStamps = currentStamps % effectiveTotal;
  const stamps = Array.from({ length: effectiveTotal }, (_, i) => i + 1);

  // Map each reward's required stamps
  const rewardMilestones = {};
  rewards.forEach((r) => {
    const required = Number(r.stampsRequired || r.requiredStamps);
    if (required > 0 && required <= effectiveTotal) {
      if (!rewardMilestones[required]) {
        rewardMilestones[required] = [];
      }
      rewardMilestones[required].push(r);
    }
  });

  // Calculate the minimum required stamps across all cafe rewards
  const sortedMilestones = Object.keys(rewardMilestones)
    .map(Number)
    .sort((a, b) => a - b);
  const minimumRewardStamps = sortedMilestones.length > 0 ? sortedMilestones[0] : null;

  // Find nearest upcoming reward milestone relative to current progress in this cycle
  const nextMilestone = sortedMilestones.find((s) => s > displayStamps) || null;
  const stampsNeededForNext = nextMilestone ? nextMilestone - displayStamps : null;
  const nextRewardObj = nextMilestone ? rewardMilestones[nextMilestone][0] : null;

  return (
    <section className="bg-(--mainColor) text-(--bgColor) rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-300 space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-sm lg:text-base font-bold">
        <div className="flex items-center gap-2">
          <span>Your Progress</span>
          {completedCycles > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
              Cycle #{completedCycles + 1}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-(--secondColor)">{displayStamps}</span>
          <span className="opacity-60">/</span>
          <span>{effectiveTotal}</span>
        </div>
      </div>

      {/* Progress Bars Grid with Highlighted Reward Milestone Bars */}
      <div
        className="grid gap-1.5 sm:gap-2 my-2.5 lg:my-3"
        style={{ gridTemplateColumns: `repeat(${effectiveTotal}, minmax(0, 1fr))` }}
      >
        {stamps.map((num) => {
          const isCollected = num <= displayStamps;
          const isRewardMilestone = Boolean(rewardMilestones[num]);
          const isMinimumReward = num === minimumRewardStamps;

          return (
            <div key={num} className="flex flex-col items-center gap-1 group relative">
              {/* Progress bar line segment */}
              <div
                className={`w-full rounded-full transition-all duration-300 relative ${
                  isRewardMilestone
                    ? "h-2.5 sm:h-3" // Thicker bar for reward milestones
                    : "h-1.5 sm:h-2"
                } ${
                  isCollected
                    ? isRewardMilestone
                      ? "bg-(--secondColor) shadow-[0_0_10px_rgba(142,197,255,0.85)] ring-1 ring-(--secondColor)"
                      : "bg-(--bgColor)"
                    : isMinimumReward
                    ? "bg-(--secondColor)/60 border border-(--secondColor) animate-pulse shadow-[0_0_8px_rgba(142,197,255,0.7)]"
                    : isRewardMilestone
                    ? "bg-(--secondColor)/35 border border-(--secondColor)/50"
                    : "opacity-25 bg-(--bgColor)"
                }`}
              />

              {/* Reward Icon / Marker on milestone bars */}
              {isRewardMilestone && (
                <div
                  className={`flex flex-col items-center justify-center -mt-0.5 transition-transform group-hover:scale-110 ${
                    isCollected
                      ? "text-(--secondColor)"
                      : isMinimumReward
                      ? "text-(--secondColor)"
                      : "text-(--bgColor)/75"
                  }`}
                  title={`${rewardMilestones[num].map((r) => r.name).join(", ")} (${num} stamps)`}
                >
                  {isMinimumReward ? (
                    <div className="flex flex-col items-center">
                      <LuSparkles className="w-3.5 h-3.5 animate-bounce" />
                      <span className="text-[9px] font-bold text-(--secondColor) hidden sm:inline">
                        Min
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <LuGift className="w-3 h-3" />
                      <span className="text-[9px] font-semibold opacity-80 hidden sm:inline">
                        {num}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Status / Nearest Reward Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-[13px] pt-0.5">
        <p className="opacity-85">
          {stampsNeededForNext ? (
            <>
              Collect <strong className="text-(--secondColor) font-bold">{stampsNeededForNext}</strong> more{" "}
              {stampsNeededForNext === 1 ? "stamp" : "stamps"} to unlock{" "}
              <strong className="text-(--secondColor) font-bold">&ldquo;{nextRewardObj?.name}&rdquo;</strong>!
            </>
          ) : completedCycles > 0 && displayStamps === 0 ? (
            <>
              🎉 Completed card! You can redeem your perks or earn more in Cycle #{completedCycles + 1}.
            </>
          ) : (
            <>
              Collect {Math.max(0, effectiveTotal - displayStamps)} more stamps to complete this card.
            </>
          )}
        </p>

        {minimumRewardStamps && (
          <span className="text-[11px] font-semibold opacity-90 shrink-0 flex items-center gap-1 text-(--secondColor)">
            <LuSparkles className="w-3 h-3 animate-pulse" />
            <span>Minimum reward at {minimumRewardStamps} stamps</span>
          </span>
        )}
      </div>
    </section>
  );
}
