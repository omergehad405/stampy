"use client";

import React from "react";
import { LuGift, LuSparkles } from "react-icons/lu";

// Barista tamper icon matching the Home Page design
function TamperIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="4.8" r="2.8" />
      <rect x="10.8" y="7.6" width="2.4" height="4.2" rx="0.4" />
      <path d="M8.5 11.8h7a0.8 0.8 0 0 1 0.8 0.8v1.2H7.7v-1.2a0.8 0.8 0 0 1 0.8-0.8z" />
      <rect x="6.5" y="14.2" width="11" height="2.6" rx="0.6" />
      <rect x="5.5" y="17.4" width="13" height="1.6" rx="0.5" />
    </svg>
  );
}

export default function StampBalanceCard({
  stampsBalance = 0,
  unlockedCount = 0,
  nextReward = null,
  cafe = null,
  rewards = [],
}) {
  const effectiveTotal = cafe?.stampTarget > 0 ? cafe.stampTarget : 10;
  // Calculate completed cycles and the displayed progress inside the current card
  const completedCycles = Math.floor(stampsBalance / effectiveTotal);
  const displayStamps = stampsBalance % effectiveTotal;
  const steps = Array.from({ length: effectiveTotal }, (_, i) => i + 1);

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
  const nextMilestoneRewardObj = nextMilestone ? rewardMilestones[nextMilestone][0] : null;

  return (
    <section className="bg-(--mainColor) text-(--bgColor) rounded-2xl lg:rounded-3xl p-5 sm:p-6 shadow-sm transition-colors duration-300 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-75">
            Available Stamp Balance
          </span>
          {completedCycles > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
              Cycle #{completedCycles + 1}
            </span>
          )}
        </div>

        {unlockedCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
            <LuSparkles className="w-3 h-3" />
            {unlockedCount} {unlockedCount === 1 ? "Reward" : "Rewards"} Ready!
          </span>
        )}
      </div>

      {/* Balance Count & Cycle Indicator */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {stampsBalance}
          </h2>
          <span className="text-sm sm:text-base font-semibold opacity-85">
            {stampsBalance === 1 ? "stamp available" : "stamps available"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold opacity-80">
          <span className="text-(--secondColor)">{displayStamps}</span>
          <span>/</span>
          <span>{effectiveTotal} in current card</span>
        </div>
      </div>

      {/* Visual Gauge Progress Bar with Highlighted Reward Milestone Bars */}
      <div
        className="grid gap-1.5 sm:gap-2 my-2.5"
        style={{ gridTemplateColumns: `repeat(${effectiveTotal}, minmax(0, 1fr))` }}
      >
        {steps.map((num) => {
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

      {/* Motivational / Contextual Message & Nearest Reward Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-[13px] pt-2 border-t border-(--bgColor)/15 opacity-90">
        <p className="flex items-center gap-1.5 font-medium">
          <TamperIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
          {stampsNeededForNext ? (
            <span>
              Collect <strong className="text-(--secondColor) font-bold">{stampsNeededForNext}</strong> more{" "}
              {stampsNeededForNext === 1 ? "stamp" : "stamps"} to unlock{" "}
              <strong className="text-(--secondColor) font-bold">&ldquo;{nextMilestoneRewardObj?.name}&rdquo;</strong>!
            </span>
          ) : unlockedCount > 0 ? (
            <span>You have enough stamps to redeem a reward today!</span>
          ) : completedCycles > 0 && displayStamps === 0 ? (
            <span>🎉 Card complete! You can redeem your perks or earn more in Cycle #{completedCycles + 1}.</span>
          ) : (
            <span>Present your QR code when visiting the cafe to collect stamps.</span>
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
