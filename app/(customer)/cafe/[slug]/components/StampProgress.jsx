"use client";

import React from "react";

export default function StampProgress({ currentStamps, totalStamps }) {
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <section className="bg-(--mainColor) text-(--bgColor) rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between text-sm lg:text-base font-bold">
        <span>Your Progress</span>
        <span>
          {currentStamps} / {totalStamps}
        </span>
      </div>

      <div
        className="grid gap-1.5 sm:gap-2 my-3 lg:my-4"
        style={{ gridTemplateColumns: `repeat(${totalStamps}, minmax(0, 1fr))` }}
      >
        {stamps.map((num) => (
          <div
            key={num}
            className={`h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${num <= currentStamps
              ? "bg-(--bgColor)"
              : "opacity-30 bg-(--bgColor)"
              }`}
          />
        ))}
      </div>

      <p className="text-xs sm:text-sm opacity-80">
        Collect {Math.max(0, totalStamps - currentStamps)} more stamps to unlock your reward.
      </p>
    </section>
  );
}
