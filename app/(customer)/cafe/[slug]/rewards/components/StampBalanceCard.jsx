"use client";

import React from "react";
import { LuSparkles } from "react-icons/lu";

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
  stampsBalance = 8,
  unlockedCount = 2,
  nextReward = null,
}) {
  // Visual gauge with max 15 steps (reflecting the rewards catalog max)
  const maxDisplaySteps = 15;
  const steps = Array.from({ length: maxDisplaySteps }, (_, i) => i + 1);

  return (
    <section className="bg-(--mainColor) text-(--bgColor) rounded-2xl lg:rounded-3xl p-5 sm:p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider opacity-75">
          Available Stamp Balance
        </span>
        {unlockedCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
            <LuSparkles className="w-3 h-3" />
            {unlockedCount} {unlockedCount === 1 ? "Reward" : "Rewards"} Ready!
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {stampsBalance}
        </h2>
        <span className="text-sm sm:text-base font-semibold opacity-85">
          {stampsBalance === 1 ? "stamp available" : "stamps available"}
        </span>
      </div>

      {/* Visual Gauge Progress Bar */}
      <div className="mt-4 mb-3">
        <div className="grid grid-cols-15 gap-1 sm:gap-1.5">
          {steps.map((num) => {
            const isFilled = num <= stampsBalance;
            return (
              <div
                key={num}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${isFilled
                  ? "bg-(--secondColor) shadow-xs"
                  : "bg-(--bgColor)/20"
                  }`}
                title={`Stamp ${num}`}
              />
            );
          })}
        </div>
      </div>

      {/* Motivational / Contextual Message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm pt-1 border-t border-(--bgColor)/15 opacity-90">
        <p className="flex items-center gap-1.5 font-medium">
          <TamperIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
          {unlockedCount > 0 ? (
            <span>
              You have enough stamps to redeem a reward today!
            </span>
          ) : (
            <span>
              Present your QR code when visiting the cafe to collect stamps.
            </span>
          )}
        </p>

        {nextReward && (
          <span className="font-semibold text-(--secondColor)">
            Next unlock: {nextReward.name} ({nextReward.stampsRequired - stampsBalance} more)
          </span>
        )}
      </div>
    </section>
  );
}
