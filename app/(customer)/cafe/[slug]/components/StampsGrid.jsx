"use client";

import React from "react";
import { LuCoffee } from "react-icons/lu";

function TamperIcon({ className = "w-5 h-5" }) {
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

export default function StampsGrid({ currentStamps, totalStamps }) {
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <section>
      <h3 className="text-base lg:text-lg font-bold mb-3">Your Stamps</h3>

      <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
        {stamps.map((num) => {
          const isCollected = num <= currentStamps;
          return (
            <div
              key={num}
              className={`aspect-[4/5] rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 lg:gap-2 transition-all duration-300 ${isCollected
                ? "bg-(--mainColor) text-(--bgColor) shadow-sm hover:scale-[1.03]"
                : "bg-(--bgColor) text-(--mainColor) border border-(--mainColor) opacity-70"
                }`}
            >
              {isCollected ? (
                <TamperIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              ) : (
                <LuCoffee className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              )}
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold">
                {num}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
